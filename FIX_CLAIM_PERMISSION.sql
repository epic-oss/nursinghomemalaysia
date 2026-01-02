-- ========================================
-- FIX: Allow Users to Claim Unclaimed Listings
-- ========================================
-- Run this in Supabase SQL Editor if claiming doesn't work
-- https://supabase.com/dashboard/project/bgrtsijikctafnlqikzl/sql
-- ========================================

-- The Problem:
-- Users couldn't claim unclaimed listings because the RLS policy
-- only allowed updating companies WHERE user_id = their ID.
-- But unclaimed companies have user_id = NULL!

-- The Solution:
-- Allow users to update companies where:
-- 1. They own it (user_id = their ID), OR
-- 2. It's unclaimed (user_id IS NULL)

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can update their own companies" ON companies;

-- Create the new policy that allows claiming
CREATE POLICY "Users can update their own companies or claim unclaimed"
  ON nursing_homes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- DONE! Users can now claim listings!
-- ========================================
