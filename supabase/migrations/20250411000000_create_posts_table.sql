
-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  location TEXT,
  tags TEXT[] DEFAULT '{}',
  timestamp BIGINT NOT NULL,
  "pullingUp" INTEGER DEFAULT 0
);

-- Enable row level security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous reads
CREATE POLICY "Allow anonymous read access" ON public.posts
  FOR SELECT USING (true);

-- Create policy to allow anonymous inserts
CREATE POLICY "Allow anonymous insert access" ON public.posts
  FOR INSERT WITH CHECK (true);

-- Create policy to allow anonymous updates
CREATE POLICY "Allow anonymous update access" ON public.posts
  FOR UPDATE USING (true);
