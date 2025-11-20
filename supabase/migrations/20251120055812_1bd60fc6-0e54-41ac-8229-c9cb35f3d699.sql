-- Fix RLS policies on user_roles table to prevent privilege escalation

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can only self-assign customer role" ON user_roles;

-- Create restrictive INSERT policy - users can ONLY self-assign customer role
CREATE POLICY "Users can only self-assign customer role"
ON user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND
  role = 'customer' AND
  outlet_id IS NULL
);

-- Create policy allowing admins to assign any role
CREATE POLICY "Admins can assign any role"
ON user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Prevent users from updating their own roles
DROP POLICY IF EXISTS "Users cannot update roles" ON user_roles;
CREATE POLICY "Users cannot update their own roles"
ON user_roles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Prevent users from deleting roles unless they're admin
DROP POLICY IF EXISTS "Only admins can delete roles" ON user_roles;
CREATE POLICY "Only admins can delete roles"
ON user_roles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);