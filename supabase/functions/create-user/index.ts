import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify the user is authenticated and has admin privileges
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user has admin privileges using secure database lookup
    const { data: userRecord, error: userError } = await supabaseAdmin
      .from('supabase_users')
      .select(`
        id_user,
        supabase_roles!inner(name)
      `)
      .eq('user_id', user.id)
      .single()

    if (userError || !userRecord) {
      console.log('User not found in supabase_users table:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found in system' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const userRole = userRecord.supabase_roles?.name;
    
    if (!userRole || !['XEVON', 'Admin'].includes(userRole)) {
      console.log('Insufficient permissions. User role:', userRole);
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse the request body
    const { name, email, role, team, avatar_url } = await req.json()

    if (!name || !email || !role || !team) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user with this email already exists in auth
    const { data: existingAuthUser, error: authCheckError } = await supabaseAdmin.auth.admin.listUsers();
    
    const userExists = existingAuthUser?.users?.some(u => u.email === email);
    
    if (userExists) {
      return new Response(
        JSON.stringify({ error: 'User with this email already exists' }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get role ID for the requested role
    const { data: targetRole, error: roleError } = await supabaseAdmin
      .from('supabase_roles')
      .select('id_role, name')
      .eq('name', role)
      .single();

    if (roleError || !targetRole) {
      return new Response(
        JSON.stringify({ error: `Invalid role: ${role}` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate role permissions
    if (userRole === 'Admin' && !['XEVON', 'Admin', 'Tech', 'User'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Admins can only create XEVON, Admin, Tech, or User roles' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Creating user with email: ${email}, role: ${role}, team: ${team}`);

    // Create the user in Supabase Auth
    const { data: authData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: Math.random().toString(36).slice(-8) + 'Temp!123', // Temporary password
      email_confirm: true,
      user_metadata: {
        name,
        role,
        team
      }
    })

    if (createUserError) {
      console.error('Auth user creation error:', createUserError)
      return new Response(
        JSON.stringify({ error: createUserError.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!authData.user) {
      console.error('No user returned from auth creation')
      return new Response(
        JSON.stringify({ error: 'Failed to create user' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Auth user created with ID: ${authData.user.id}`);

    // Create user record in supabase_users table
    const { data: supabaseUserData, error: createSupabaseUserError } = await supabaseAdmin
      .from('supabase_users')
      .insert({
        user_id: authData.user.id,
        email: email,
        id_role: targetRole.id_role,
        id_organization: null // Will be set later when user is assigned to organization
      })
      .select(`
        id_user,
        email,
        user_id,
        supabase_roles!inner(name)
      `)
      .single();
    
    if (createSupabaseUserError) {
      console.error('Error creating supabase user record:', createSupabaseUserError);
      // Clean up the auth user if supabase_users creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return new Response(
        JSON.stringify({ error: 'Failed to create user record in system' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Supabase user record created successfully:', supabaseUserData)

    return new Response(
      JSON.stringify({ 
        message: 'User created successfully',
        user: {
          id: supabaseUserData.user_id,
          email: supabaseUserData.email,
          role: supabaseUserData.supabase_roles.name,
          name: name
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})