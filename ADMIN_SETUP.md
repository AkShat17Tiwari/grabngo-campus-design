# Admin User Setup Guide

## Creating the Admin User

Since this project uses Lovable Cloud (Supabase), you need to create the admin user through the authentication system and then assign the admin role.

### Step 1: Create Admin User Account

1. Navigate to your application's sign-up page
2. Create a new account with:
   - **Email**: `akshatr147@gmail.com`
   - **Password**: `1234567` (or your preferred secure password)
3. Complete the sign-up process

### Step 2: Assign Admin Role

After creating the account, you need to assign the admin role to this user in the database.

#### Option A: Using the Lovable Cloud Dashboard

1. Click "View Backend" in your Lovable project
2. Navigate to the Database section
3. Open the `user_roles` table
4. Click "Insert Row"
5. Fill in the following:
   - `user_id`: Copy the user ID from the `auth.users` table for `akshatr147@gmail.com`
   - `role`: Select `admin` from the dropdown
   - `outlet_id`: Leave as `NULL`
6. Click "Save"

#### Option B: Using SQL Query

In the Lovable Cloud backend SQL editor, run:

```sql
-- First, find the user_id for the admin email
SELECT id FROM auth.users WHERE email = 'akshatr147@gmail.com';

-- Then insert the admin role (replace USER_ID_HERE with the actual UUID)
INSERT INTO public.user_roles (user_id, role, outlet_id)
VALUES ('USER_ID_HERE', 'admin', NULL);
```

### Step 3: Verify Admin Access

1. Sign out if you're currently logged in
2. Sign in with the admin credentials:
   - Email: `akshatr147@gmail.com`
   - Password: `1234567`
3. You should be automatically redirected to `/admin/dashboard`
4. Verify you can see:
   - Global sales graphs
   - Top-selling items across all vendors
   - Total revenue, orders, vendors, and refunds
   - Hour-wise order distribution

## Admin Dashboard Features

The admin dashboard at `/admin/dashboard` includes:

### Quick Stats
- **Total Orders**: All orders across the platform
- **Total Revenue**: Sum of all completed orders
- **Completed Orders**: Successfully fulfilled orders
- **Average Order Value**: Revenue per completed order
- **Total Vendors**: Number of registered vendor staff
- **Refunds**: Number of cancelled orders

### Analytics Charts
- **Orders Over Time**: Line chart showing order trends
- **Revenue Over Time**: Bar chart showing revenue trends
- **Orders by Hour**: Distribution of orders throughout the day
- **Top 10 Items**: Most ordered items across all vendors

### Period Filters
- Last 7 Days (daily breakdown)
- Last 4 Weeks (weekly breakdown)
- Last 6 Months (monthly breakdown)

## Security Notes

### Current Implementation
- Admin role is stored in the `user_roles` table (separate from user profiles)
- Admin access is verified on both client-side (routing) and server-side (edge functions)
- Edge functions validate admin role before returning analytics data
- RLS policies ensure data security at the database level

### Production Recommendations
1. **Change the admin password** immediately after first login
2. **Enable 2FA** if available in your authentication provider
3. **Use environment variables** for sensitive configuration
4. **Regular security audits** of the user_roles table
5. **Monitor admin access logs** for suspicious activity

## Troubleshooting

### "Forbidden - Admin access required" Error
- Ensure the admin role was correctly inserted in the `user_roles` table
- Verify the `user_id` matches the authenticated user's ID
- Check that the role is set to `'admin'` (not `'customer'` or `'vendor_staff'`)

### Dashboard Shows No Data
- If real order data is not available, the dashboard will show demo data
- Create some test orders to see real analytics
- Check browser console for any API errors

### Cannot Access Admin Dashboard
- Ensure you're logged in with the admin account
- Check that the route is `/admin/dashboard` (not `/admin` or `/dashboard`)
- Verify the `ProtectedRoute` wrapper allows admin role access

## API Endpoints

The following edge functions power the admin dashboard:

### `/admin-analytics`
Query parameters:
- `endpoint`: `summary` | `top-items` | `orders-by-date` | `orders-by-hour`
- `period`: `daily` | `weekly` | `monthly`

All endpoints require:
- Valid JWT token in Authorization header
- User must have `admin` role in `user_roles` table

## Creating Additional Admin Users

To create more admin users, repeat Steps 1-2 above with different email addresses. Multiple users can have the admin role simultaneously.
