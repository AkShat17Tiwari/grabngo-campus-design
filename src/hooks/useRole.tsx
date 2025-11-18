import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

type Role = 'admin' | 'vendor_staff' | 'customer';

export const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [outletId, setOutletId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role, outlet_id')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching role:', error);
          // Default to customer if no role assigned
          setRole('customer');
        } else if (data) {
          setRole(data.role as Role);
          setOutletId(data.outlet_id);
        } else {
          setRole('customer');
        }
      } catch (err) {
        console.error('Error:', err);
        setRole('customer');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  return { role, loading, outletId };
};
