-- Add missing fields to existing tables

-- Add current_points to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_points INTEGER DEFAULT 0;

-- Add queue and status fields to outlets table
ALTER TABLE public.outlets ADD COLUMN IF NOT EXISTS current_queue_length INTEGER DEFAULT 0;
ALTER TABLE public.outlets ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed'));

-- Add is_available to menu_items table
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- Add scheduled_pickup_slot to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS scheduled_pickup_slot TIMESTAMP WITH TIME ZONE;

-- Create order_statistics table for recommendations
CREATE TABLE IF NOT EXISTS public.order_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES public.menu_items(id) ON DELETE CASCADE,
  outlet_id INTEGER REFERENCES public.outlets(id) ON DELETE CASCADE,
  order_count INTEGER DEFAULT 1,
  last_ordered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, menu_item_id)
);

-- Enable RLS on order_statistics
ALTER TABLE public.order_statistics ENABLE ROW LEVEL SECURITY;

-- RLS policies for order_statistics
CREATE POLICY "Users can view their own statistics"
  ON public.order_statistics
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage statistics"
  ON public.order_statistics
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to update order statistics
CREATE OR REPLACE FUNCTION public.update_order_statistics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When order is completed, update statistics
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Update statistics for each item in the order
    INSERT INTO public.order_statistics (user_id, menu_item_id, outlet_id, order_count, last_ordered_at)
    SELECT 
      NEW.user_id,
      oi.menu_item_id,
      NEW.outlet_id,
      1,
      NOW()
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id
    ON CONFLICT (user_id, menu_item_id)
    DO UPDATE SET
      order_count = order_statistics.order_count + 1,
      last_ordered_at = NOW(),
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for order statistics
DROP TRIGGER IF EXISTS update_order_statistics_trigger ON public.orders;
CREATE TRIGGER update_order_statistics_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_order_statistics();

-- Create function to calculate queue time
CREATE OR REPLACE FUNCTION public.calculate_pickup_time(
  _outlet_id INTEGER,
  _items_count INTEGER
)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  queue_length INTEGER;
  prep_time_minutes INTEGER;
  pickup_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current queue length
  SELECT COALESCE(current_queue_length, 0) INTO queue_length
  FROM public.outlets
  WHERE id = _outlet_id;
  
  -- Calculate preparation time (5 minutes per item in queue + 3 minutes per item in new order)
  prep_time_minutes := (queue_length * 5) + (_items_count * 3);
  
  -- Calculate pickup time
  pickup_time := NOW() + (prep_time_minutes || ' minutes')::INTERVAL;
  
  RETURN pickup_time;
END;
$$;

-- Add trigger to update outlet queue on order placement
CREATE OR REPLACE FUNCTION public.update_outlet_queue()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'placed' AND (OLD.status IS NULL OR OLD.status = 'pending_payment') THEN
    -- Increment queue
    UPDATE public.outlets
    SET current_queue_length = current_queue_length + 1
    WHERE id = NEW.outlet_id;
  ELSIF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Decrement queue
    UPDATE public.outlets
    SET current_queue_length = GREATEST(current_queue_length - 1, 0)
    WHERE id = NEW.outlet_id;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_outlet_queue_trigger ON public.orders;
CREATE TRIGGER update_outlet_queue_trigger
  AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_outlet_queue();

-- Create function to award points on order completion
CREATE OR REPLACE FUNCTION public.award_points_on_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  points_to_award INTEGER;
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Award 1 point per 10 INR spent
    points_to_award := FLOOR(NEW.total / 10);
    
    -- Update user's current points
    UPDATE public.profiles
    SET current_points = current_points + points_to_award
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS award_points_trigger ON public.orders;
CREATE TRIGGER award_points_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.award_points_on_completion();