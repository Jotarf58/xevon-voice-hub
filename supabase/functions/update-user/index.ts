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
    const { id, name, email, role, team, avatar_url } = await req.json()

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Missing user ID' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get role ID for the requested role if role is being updated
    let targetRoleId = null;
    if (role) {
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
      
      targetRoleId = targetRole.id_role;

      // Validate role permissions
      if (userRole === 'Admin' && !['XEVON', 'Admin', 'Tech', 'User'].includes(role)) {
        return new Response(
          JSON.stringify({ error: 'Admins can only assign XEVON, Admin, Tech, or User roles' }),
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    console.log(`Updating user with ID: ${id}, email: ${email}, role: ${role}`);

    // Update the user record in supabase_users table
    const updateData: any = {};
    if (email) updateData.email = email;
    if (targetRoleId) updateData.id_role = targetRoleId;

    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('supabase_users')
      .update(updateData)
      .eq('id_user', id)
      .select(`
        id_user,
        email,
        user_id,
        supabase_roles!inner(name)
      `)
      .single()

    if (updateError) {
      console.error('User update error:', updateError)
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('User updated successfully:', updatedUser)

    return new Response(
      JSON.stringify({ 
        message: 'User updated successfully',
        user: {
          id: updatedUser.user_id,
          email: updatedUser.email,
          role: updatedUser.supabase_roles.name
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