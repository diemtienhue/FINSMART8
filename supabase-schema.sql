-- =============================================
-- FINSMART SUPABASE SCHEMA
-- Run this SQL in your Supabase SQL Editor
-- =============================================

-- 1. CREATE PROJECTS TABLE
-- Bảng chứa thông tin sản phẩm (Vay & Thẻ tín dụng)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('LOAN', 'CREDIT_CARD')),
  logo TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  limit_amount TEXT NOT NULL DEFAULT '',
  interest_rate TEXT NOT NULL DEFAULT '',
  interest_free_period TEXT,
  description TEXT NOT NULL DEFAULT '',
  advantages TEXT[] NOT NULL DEFAULT '{}',
  promo TEXT NOT NULL DEFAULT '',
  affiliate_link TEXT NOT NULL DEFAULT '',
  referral_code TEXT,
  tutorial_video_url TEXT,
  tutorial_file_url TEXT,
  eligibility TEXT[] NOT NULL DEFAULT '{}',
  bank_phone TEXT,
  bank_website TEXT,
  bank_intro TEXT,
  payment_channels TEXT[],
  steps JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Published', 'Draft')),
  order_index INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1),
  user_count TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE APP_SETTINGS TABLE
-- Bảng lưu cài đặt hệ thống (Hero Slide, Zalo Support, etc.)
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE PARTNER_LOGOS TABLE
-- Bảng lưu logo đối tác
CREATE TABLE IF NOT EXISTS partner_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_logos ENABLE ROW LEVEL SECURITY;

-- Projects: Public read, authenticated write
CREATE POLICY "Public can read published projects" ON projects
  FOR SELECT USING (status = 'Published');

CREATE POLICY "Authenticated users can read all projects" ON projects
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert projects" ON projects
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects" ON projects
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete projects" ON projects
  FOR DELETE TO authenticated USING (true);

-- App Settings: Public read, authenticated write
CREATE POLICY "Public can read app settings" ON app_settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage app settings" ON app_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Partner Logos: Public read, authenticated write
CREATE POLICY "Public can read active partner logos" ON partner_logos
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage partner logos" ON partner_logos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Create storage bucket for images (run in Supabase Dashboard > Storage)
-- Bucket name: images
-- Public: true

-- =============================================
-- TRIGGERS FOR updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INITIAL SEED DATA (Optional)
-- =============================================

-- Insert default Hero Settings
INSERT INTO app_settings (key, value) VALUES (
  'hero_settings',
  '{
    "heroTitle": "Tài Chính Thông Minh",
    "heroSubtitle": "Giải pháp so sánh và lựa chọn sản phẩm tài chính tối ưu nhất dành cho bạn.",
    "heroImage": "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200",
    "zaloSupport": "0123456789"
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);
CREATE INDEX IF NOT EXISTS idx_partner_logos_active ON partner_logos(is_active);
