CREATE TABLE simplex.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(email) <= 254),
  company text NOT NULL DEFAULT '' CHECK (char_length(company) <= 160),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 5000),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);
-- statement-breakpoint
CREATE INDEX contact_submissions_created_at_idx
ON simplex.contact_submissions (created_at DESC);
-- statement-breakpoint
CREATE TABLE simplex.contact_rate_limits (
  key_hash text PRIMARY KEY,
  window_started_at timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 1 CHECK (attempts > 0)
);
