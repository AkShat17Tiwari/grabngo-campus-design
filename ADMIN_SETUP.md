# Admin User Setup Guide

## 🚀 Automatic Admin Setup (Recommended)

The easiest way to create the admin user is using the automated setup page.

### Method 1: Using Setup Page

1. Navigate to `/admin/setup` in your application
2. Click "Create Admin User" button
3. The system will automatically create:
   - **Email**: `akshatr147@gmail.com`
   - **Password**: `1234567`
   - **Role**: `admin`
4. You'll be redirected to login page automatically

---

## 🔐 Login as Admin

After setup is complete:

1. Navigate to `/auth`
2. Click "Sign In" tab
3. Enter credentials:
   - Email: `akshatr147@gmail.com`
   - Password: `1234567`
4. You'll be automatically redirected to `/admin/dashboard`

⚠️ **SECURITY WARNING**: Change this password immediately after first login!

---

## 📊 Admin Dashboard Features

The admin dashboard provides platform-wide analytics and management capabilities.

### Quick Stats Cards
- **Total Orders**: All orders across the platform
- **Total Revenue**: Sum of all completed orders (₹)
- **Completed Orders**: Successfully fulfilled orders
- **Average Order Value**: Revenue per completed order (₹)
- **Total Vendors**: Number of registered vendor staff
- **Refunds**: Number of cancelled orders

### Analytics Charts

**Period Filters**: Last 7 Days | Last 4 Weeks | Last 6 Months

1. **Orders Over Time** (Line Chart) - Track order volume trends
2. **Revenue Over Time** (Bar Chart) - Monitor revenue trends
3. **Orders by Hour** (Bar Chart) - 24-hour distribution
4. **Top 10 Items** (List) - Most ordered items across all vendors

---

## 🔒 Security & Access Control

### Role-Based Access

**Admin** (`admin`) → `/admin/dashboard` - Global analytics, all vendors, all orders
**Vendor** (`vendor_staff`) → `/vendor/dashboard` - Only their outlet's data  
**Customer** (`customer`) → `/`, `/menu`, `/cart`, `/orders` - Standard features

### Security Implementation

- Client-side: `ProtectedRoute` component checks role
- Server-side: Edge functions verify JWT and role
- Database: RLS policies + separate `user_roles` table

**Production Checklist:**
- [ ] Change default password
- [ ] Enable 2FA
- [ ] Monitor access logs
- [ ] Regular security audits

---

## 🐛 Troubleshooting

### "Forbidden - Admin access required"
1. Verify role in `user_roles` table
2. Log out and back in
3. Check browser console for errors

### Dashboard Shows Demo Data
- Normal when no real orders exist
- Create test orders to see real data

### Cannot Access Dashboard
1. Confirm you're logged in
2. URL should be `/admin/dashboard`
3. Verify admin role assigned
4. Clear browser cache

---

## 📝 Default Credentials

```
Email: akshatr147@gmail.com
Password: 1234567
Role: admin
```

**Quick Links**: `/admin/setup` | `/auth` | `/admin/dashboard`
