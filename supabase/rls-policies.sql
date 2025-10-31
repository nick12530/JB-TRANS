-- Complete RLS Policy Setup for Mwalimu Transporters
-- Run this entire script in Supabase SQL Editor to enable data persistence

-- ============================================
-- PACKAGES TABLE
-- ============================================
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (safe to ignore if they don't exist)
DROP POLICY IF EXISTS "anon_select_packages" ON packages;
DROP POLICY IF EXISTS "anon_insert_packages" ON packages;
DROP POLICY IF EXISTS "anon_update_packages" ON packages;
DROP POLICY IF EXISTS "anon_delete_packages" ON packages;

-- Create policies for anonymous access
CREATE POLICY "anon_select_packages" ON packages FOR SELECT USING (true);
CREATE POLICY "anon_insert_packages" ON packages FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_packages" ON packages FOR UPDATE USING (true);
CREATE POLICY "anon_delete_packages" ON packages FOR DELETE USING (true);

-- ============================================
-- USERS TABLE
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_users" ON users;
DROP POLICY IF EXISTS "anon_insert_users" ON users;
DROP POLICY IF EXISTS "anon_update_users" ON users;
DROP POLICY IF EXISTS "anon_delete_users" ON users;

CREATE POLICY "anon_select_users" ON users FOR SELECT USING (true);
CREATE POLICY "anon_insert_users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_users" ON users FOR UPDATE USING (true);
CREATE POLICY "anon_delete_users" ON users FOR DELETE USING (true);

-- ============================================
-- CLIENTS TABLE
-- ============================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_clients" ON clients;
DROP POLICY IF EXISTS "anon_insert_clients" ON clients;
DROP POLICY IF EXISTS "anon_update_clients" ON clients;
DROP POLICY IF EXISTS "anon_delete_clients" ON clients;

CREATE POLICY "anon_select_clients" ON clients FOR SELECT USING (true);
CREATE POLICY "anon_insert_clients" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_clients" ON clients FOR UPDATE USING (true);
CREATE POLICY "anon_delete_clients" ON clients FOR DELETE USING (true);

-- ============================================
-- STATIONS TABLE
-- ============================================
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_stations" ON stations;
DROP POLICY IF EXISTS "anon_insert_stations" ON stations;
DROP POLICY IF EXISTS "anon_update_stations" ON stations;
DROP POLICY IF EXISTS "anon_delete_stations" ON stations;

CREATE POLICY "anon_select_stations" ON stations FOR SELECT USING (true);
CREATE POLICY "anon_insert_stations" ON stations FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_stations" ON stations FOR UPDATE USING (true);
CREATE POLICY "anon_delete_stations" ON stations FOR DELETE USING (true);

-- ============================================
-- AREA_CODES TABLE
-- ============================================
ALTER TABLE area_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_area_codes" ON area_codes;
DROP POLICY IF EXISTS "anon_insert_area_codes" ON area_codes;
DROP POLICY IF EXISTS "anon_update_area_codes" ON area_codes;
DROP POLICY IF EXISTS "anon_delete_area_codes" ON area_codes;

CREATE POLICY "anon_select_area_codes" ON area_codes FOR SELECT USING (true);
CREATE POLICY "anon_insert_area_codes" ON area_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_area_codes" ON area_codes FOR UPDATE USING (true);
CREATE POLICY "anon_delete_area_codes" ON area_codes FOR DELETE USING (true);

-- ============================================
-- VERIFICATION QUERY (Optional - Run to verify)
-- ============================================
-- Uncomment below to check all policies are active:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd 
-- FROM pg_policies 
-- WHERE tablename IN ('packages', 'users', 'clients', 'stations', 'area_codes')
-- ORDER BY tablename, policyname;

