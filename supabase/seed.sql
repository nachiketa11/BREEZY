-- ═══════════════════════════════════════════════════════════════════════════════
-- BREEZY — Demo Seed Data
-- Run AFTER schema.sql. Replace <USER_ID> with your Supabase Auth user ID.
--
-- To find your user ID:
--   1. Sign up at /signup
--   2. Go to Supabase Dashboard → Authentication → Users
--   3. Copy the UUID from the "UID" column
-- ═══════════════════════════════════════════════════════════════════════════════

-- Replace this with your actual auth user ID
-- Example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

DO $$
DECLARE
  uid uuid;
BEGIN
  -- Grab the first user in auth.users (works for single-user demos)
  SELECT id INTO uid FROM auth.users LIMIT 1;

  IF uid IS NULL THEN
    RAISE NOTICE 'No users found in auth.users — sign up first, then re-run this script.';
    RETURN;
  END IF;

  -- ── Profile ─────────────────────────────────────────────────────────────
  INSERT INTO profiles (id, name, branch, semester)
  VALUES (uid, 'Priya Sharma', 'Computer Science', 5)
  ON CONFLICT (id) DO UPDATE SET name = 'Priya Sharma', branch = 'Computer Science', semester = 5;

  -- ── Tasks ───────────────────────────────────────────────────────────────
  INSERT INTO tasks (user_id, title, subject, priority, due_date, completed) VALUES
    (uid, 'Submit OS assignment',           'Operating Systems',      'high',   CURRENT_DATE,       false),
    (uid, 'Read Chapter 7 — Deadlocks',     'Operating Systems',      'medium', CURRENT_DATE,       false),
    (uid, 'Debug linked list program',       'Data Structures',        'high',   CURRENT_DATE + 1,   false),
    (uid, 'Prepare DBMS ER diagrams',        'Database Systems',       'medium', CURRENT_DATE + 2,   false),
    (uid, 'Practice integration problems',   'Engineering Maths III',  'low',    CURRENT_DATE + 3,   false),
    (uid, 'Review pull request #42',         'Software Engineering',   'medium', CURRENT_DATE + 1,   false),
    (uid, 'Write lab report — Ohm''s Law',   'Physics Lab',            'low',    CURRENT_DATE + 4,   false),
    (uid, 'Study for quiz on sorting',       'Data Structures',        'high',   CURRENT_DATE,       false),
    (uid, 'Complete UML diagrams',           'Software Engineering',   'medium', CURRENT_DATE + 5,   true),
    (uid, 'Submit mini project proposal',    'Database Systems',       'high',   CURRENT_DATE - 1,   true);

  -- ── Attendance ──────────────────────────────────────────────────────────
  INSERT INTO attendance (user_id, subject, attended, total) VALUES
    (uid, 'Operating Systems',      22, 30),   -- 73% — WARNING (1 class away from 75%)
    (uid, 'Data Structures',        28, 30),   -- 93% — PERFECT
    (uid, 'Database Systems',       18, 28),   -- 64% — DANGER
    (uid, 'Engineering Maths III',  24, 30),   -- 80% — SAFE
    (uid, 'Software Engineering',   26, 30),   -- 87% — SAFE
    (uid, 'Physics Lab',            12, 15);   -- 80% — SAFE

  -- ── Events ──────────────────────────────────────────────────────────────
  INSERT INTO events (user_id, title, event_date, event_time) VALUES
    (uid, 'OS Mid-Semester Exam',         CURRENT_DATE + 3,  '10:00:00'),
    (uid, 'DBMS Lab Submission',          CURRENT_DATE + 1,  '14:30:00'),
    (uid, 'Guest Lecture — Cloud Computing', CURRENT_DATE + 5,  '11:00:00'),
    (uid, 'Hackathon Registration Deadline', CURRENT_DATE,     '23:59:00'),
    (uid, 'Study Group — Data Structures',   CURRENT_DATE + 2, '16:00:00');

  RAISE NOTICE 'Demo data seeded for user %', uid;
END $$;
