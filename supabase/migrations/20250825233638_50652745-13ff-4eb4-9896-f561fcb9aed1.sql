-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_role_id bigint;
BEGIN
  -- Get the 'user' role id
  SELECT id_role INTO user_role_id 
  FROM public.supabase_roles 
  WHERE name = 'user' 
  LIMIT 1;
  
  -- If no 'user' role exists, create it
  IF user_role_id IS NULL THEN
    INSERT INTO public.supabase_roles (name, description, permissions)
    VALUES ('user', 'Standard user role', 'read')
    RETURNING id_role INTO user_role_id;
  END IF;
  
  -- Insert new user record in supabase_users
  INSERT INTO public.supabase_users (user_id, id_role, email)
  VALUES (
    NEW.id,
    user_role_id,
    NEW.email
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger that fires when a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();