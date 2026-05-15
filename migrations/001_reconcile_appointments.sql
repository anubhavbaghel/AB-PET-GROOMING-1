-- Migration: reconcile appointments vs bookings
-- This script creates a canonical 'appointments' table and migrates data from legacy 'bookings' if present.
-- Run on MySQL. Review before executing.

-- 1) Create the canonical table if it does not exist
CREATE TABLE IF NOT EXISTS appointments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  owner_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(64),
  pet_name VARCHAR(255),
  pet_category VARCHAR(128),
  breed VARCHAR(255),
  pet_size VARCHAR(64),
  pet_count INT DEFAULT 1,
  multi_pet_note TEXT,
  main_service VARCHAR(255),
  addons TEXT,
  appointment_date DATE,
  appointment_time VARCHAR(64),
  notes TEXT,
  payment_method VARCHAR(64),
  payment_status VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2) If a legacy table `bookings` exists, copy rows into appointments (idempotent safeguard)
-- Adjust column mapping as necessary
INSERT INTO appointments (owner_name,email,phone,pet_name,pet_category,breed,pet_size,pet_count,multi_pet_note,main_service,addons,appointment_date,appointment_time,notes,payment_method,payment_status,created_at)
SELECT DISTINCT
  COALESCE(b.owner_name, b.name, '') as owner_name,
  COALESCE(b.email, '') as email,
  COALESCE(b.phone, '') as phone,
  COALESCE(b.pet_name, '') as pet_name,
  COALESCE(b.pet_category, '') as pet_category,
  COALESCE(b.breed, '') as breed,
  COALESCE(b.pet_size, '') as pet_size,
  COALESCE(b.pet_count, 1) as pet_count,
  COALESCE(b.multi_pet_note, '') as multi_pet_note,
  COALESCE(b.main_service, '') as main_service,
  COALESCE(b.addons, '') as addons,
  COALESCE(b.appointment_date, NULL) as appointment_date,
  COALESCE(b.appointment_time, '') as appointment_time,
  COALESCE(b.notes, '') as notes,
  COALESCE(b.payment_method, 'cash') as payment_method,
  COALESCE(b.payment_status, 'pending') as payment_status,
  COALESCE(b.created_at, NOW()) as created_at
FROM bookings b
LEFT JOIN appointments a ON a.email = b.email AND a.appointment_date = b.appointment_date AND a.appointment_time = b.appointment_time
WHERE b.id IS NOT NULL AND a.id IS NULL;

-- 3) Optionally, create a view to keep old applications working
CREATE OR REPLACE VIEW bookings_view AS
SELECT * FROM appointments;
