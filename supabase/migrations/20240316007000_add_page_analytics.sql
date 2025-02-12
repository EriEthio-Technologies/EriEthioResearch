-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES pages(id),
    path TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id),
    session_id TEXT,
    referrer TEXT,
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    country TEXT,
    region TEXT,
    city TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create page_events table for tracking specific interactions
CREATE TABLE IF NOT EXISTS page_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_view_id UUID REFERENCES page_views(id),
    event_type TEXT NOT NULL,
    event_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Page views are viewable by authenticated users"
    ON page_views FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Page events are viewable by authenticated users"
    ON page_events FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can insert page views"
    ON page_views FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can insert page events"
    ON page_events FOR INSERT
    WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_page_views_page_id ON page_views(page_id);
CREATE INDEX idx_page_views_user_id ON page_views(user_id);
CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_page_views_path ON page_views(path);
CREATE INDEX idx_page_events_page_view_id ON page_events(page_view_id);
CREATE INDEX idx_page_events_event_type ON page_events(event_type);
CREATE INDEX idx_page_events_created_at ON page_events(created_at);

-- Create function to track page views
CREATE OR REPLACE FUNCTION track_page_view(
    _page_id UUID,
    _path TEXT,
    _user_id UUID DEFAULT NULL,
    _session_id TEXT DEFAULT NULL,
    _referrer TEXT DEFAULT NULL,
    _user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    _view_id UUID;
BEGIN
    INSERT INTO page_views (
        page_id,
        path,
        user_id,
        session_id,
        referrer,
        user_agent,
        device_type,
        browser,
        os,
        country,
        region,
        city
    ) VALUES (
        _page_id,
        _path,
        _user_id,
        _session_id,
        _referrer,
        _user_agent,
        -- Parse user agent to get device type, browser, and OS
        CASE
            WHEN _user_agent ILIKE '%mobile%' THEN 'mobile'
            WHEN _user_agent ILIKE '%tablet%' THEN 'tablet'
            ELSE 'desktop'
        END,
        CASE
            WHEN _user_agent ILIKE '%firefox%' THEN 'Firefox'
            WHEN _user_agent ILIKE '%chrome%' THEN 'Chrome'
            WHEN _user_agent ILIKE '%safari%' THEN 'Safari'
            WHEN _user_agent ILIKE '%edge%' THEN 'Edge'
            ELSE 'Other'
        END,
        CASE
            WHEN _user_agent ILIKE '%windows%' THEN 'Windows'
            WHEN _user_agent ILIKE '%mac%' THEN 'MacOS'
            WHEN _user_agent ILIKE '%linux%' THEN 'Linux'
            WHEN _user_agent ILIKE '%android%' THEN 'Android'
            WHEN _user_agent ILIKE '%ios%' THEN 'iOS'
            ELSE 'Other'
        END,
        NULL, -- country (would be set by edge function)
        NULL, -- region (would be set by edge function)
        NULL  -- city (would be set by edge function)
    )
    RETURNING id INTO _view_id;

    RETURN _view_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to track page events
CREATE OR REPLACE FUNCTION track_page_event(
    _page_view_id UUID,
    _event_type TEXT,
    _event_data JSONB DEFAULT '{}'::JSONB
) RETURNS UUID AS $$
DECLARE
    _event_id UUID;
BEGIN
    INSERT INTO page_events (
        page_view_id,
        event_type,
        event_data
    ) VALUES (
        _page_view_id,
        _event_type,
        _event_data
    )
    RETURNING id INTO _event_id;

    RETURN _event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 