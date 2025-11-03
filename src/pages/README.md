# Order Flow Documentation

## Cart Addition & Display
**Location**: `Menu.tsx`

The `addToCart` function:
1. Updates local React state for immediate UI feedback
2. Syncs cart data to localStorage with proper structure:
   ```js
   {
     items: [{ id, name, price, quantity, image }],
     outletId: number,
     outletName: string
   }
   ```
3. Shows success toast notification
4. Cart summary automatically displays at bottom when items exist
5. Clicking "View Cart" navigates to `/cart` with persisted data

## Cart Page & Checkout Flow
**Location**: `Cart.tsx` → `Checkout.tsx`

1. **Cart.tsx** loads data from localStorage
2. Calculates totals (subtotal, tax 5%, delivery fee ₹20)
3. "Proceed to Checkout" passes cart data to Checkout page
4. **Checkout.tsx** validates:
   - User is authenticated
   - Customer name and phone (10 digits) are provided
   - Cart has valid items with proper IDs and quantities
   - Outlet ID exists
5. Calls `place-order` Edge Function with payload:
   ```js
   {
     outlet_id: number,
     items: [{ menu_item_id, quantity }],
     customer_name: string,
     customer_phone: string,
     special_instructions?: string
   }
   ```

## Order Placement Backend
**Location**: `supabase/functions/place-order/index.ts`

The Edge Function:
1. Validates menu items exist and are available
2. Calculates totals (subtotal, tax, total)
3. Calls `calculate_pickup_time` database function
4. Creates Razorpay order via API
5. Inserts order with status `pending_payment`
6. Returns Razorpay credentials to frontend

## Payment & Order Confirmation
**Location**: `Checkout.tsx` (Razorpay handler)

1. Frontend initializes Razorpay widget with credentials
2. User completes payment
3. On success:
   - Razorpay webhook updates order status to `placed`
   - Cart cleared from localStorage
   - User redirected to `/orders`
4. On failure:
   - Order remains `pending_payment`
   - User can retry or cancel

## Order History & Real-time Updates
**Location**: `Orders.tsx` + `hooks/useRealtimeOrders.tsx`

**useRealtimeUserOrders Hook**:
1. Fetches all orders for authenticated user (`user_id` filter)
2. Subscribes to Supabase realtime channel
3. Listens for INSERT, UPDATE, DELETE events
4. Automatically updates UI when order status changes

**Orders Page**:
1. Displays all user orders in reverse chronological order
2. Fetches order items and outlet names
3. Shows status badges with animations (`OrderStatusAnimation`)
4. Real-time status updates trigger animations automatically

## Status Flow
```
pending_payment → placed → preparing → ready → completed
                    ↓
                 failed/cancelled
```

## Key Security Features
- All database queries filtered by `auth.uid()` via RLS policies
- Backend validates menu items and calculates prices (no client trust)
- Razorpay webhook verifies signatures before updating orders
- Edge Functions require authentication (except webhook)
