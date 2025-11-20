import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get admin credentials from environment variables (stored securely as secrets)
    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    const adminPassword = Deno.env.get('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      return new Response(
        JSON.stringify({ 
          error: 'Admin credentials not configured. Please set ADMIN_EMAIL and ADMIN_PASSWORD secrets in Supabase.' 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if admins already exist
    const { count: adminCount } = await supabaseAdmin
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');

    // If admins exist, verify caller is admin
    if (adminCount && adminCount > 0) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        console.warn('Unauthorized setup-admin attempt: No auth header');
        return new Response(
          JSON.stringify({ error: 'Unauthorized. Only admins can create additional admin accounts.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      );

      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      if (userError || !user) {
        console.warn('Unauthorized setup-admin attempt: Invalid token');
        return new Response(
          JSON.stringify({ error: 'Unauthorized. Invalid authentication.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: roleData, error: roleError } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError || roleData?.role !== 'admin') {
        console.warn(`Forbidden setup-admin attempt by user ${user.id}: Not an admin`);
        return new Response(
          JSON.stringify({ error: 'Forbidden. Only admins can create additional admin accounts.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Admin ${user.id} authorized to create admin account`);
    }

    // Check if admin user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const adminExists = existingUsers?.users.some(u => u.email === adminEmail);

    if (adminExists) {
      const adminUser = existingUsers?.users.find(u => u.email === adminEmail);
      
      // Check if role exists
      const { data: roleData } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', adminUser!.id)
        .single();

      if (roleData?.role === 'admin') {
        return new Response(
          JSON.stringify({ 
            message: 'Admin user already exists and is properly configured',
            email: adminEmail 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        // Update role to admin
        await supabaseAdmin
          .from('user_roles')
          .upsert({ 
            user_id: adminUser!.id, 
            role: 'admin',
            outlet_id: null
          });

        return new Response(
          JSON.stringify({ 
            message: 'Admin role assigned to existing user',
            email: adminEmail 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create the admin user
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User',
      }
    });

    if (createError) {
      console.error('Error creating admin user:', createError);
      throw createError;
    }

    if (!userData.user) {
      throw new Error('Failed to create admin user');
    }

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: userData.user.id,
        full_name: 'Admin User',
        current_points: 0,
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
    }

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: 'admin',
        outlet_id: null,
      });

    if (roleError) {
      console.error('Error assigning admin role:', roleError);
      throw roleError;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Admin user created successfully',
        email: adminEmail,
        userId: userData.user.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in setup-admin:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
