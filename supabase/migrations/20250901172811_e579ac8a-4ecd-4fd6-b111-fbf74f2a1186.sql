-- Remove foreign key constraints to auth schema for security compliance
-- The supabase_users.user_id should reference auth.users but not as a foreign key

-- Check if there are any foreign key constraints to auth schema and remove them
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    -- Find all foreign key constraints that reference auth schema
    FOR constraint_record IN
        SELECT 
            tc.constraint_name,
            tc.table_name,
            tc.table_schema
        FROM information_schema.table_constraints tc
        JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
        JOIN information_schema.table_constraints rtc ON rc.unique_constraint_name = rtc.constraint_name
        WHERE rtc.table_schema = 'auth'
        AND tc.table_schema = 'public'
        AND tc.constraint_type = 'FOREIGN KEY'
    LOOP
        -- Drop the foreign key constraint
        EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT IF EXISTS %I',
                      constraint_record.table_schema,
                      constraint_record.table_name,
                      constraint_record.constraint_name);
        
        RAISE NOTICE 'Dropped foreign key constraint: %', constraint_record.constraint_name;
    END LOOP;
END $$;