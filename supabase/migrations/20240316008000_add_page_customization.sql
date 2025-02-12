-- Add customization settings to pages table
ALTER TABLE pages
ADD COLUMN IF NOT EXISTS customization JSONB DEFAULT '{
  "layout": {
    "type": "default",
    "width": "container",
    "padding": "md",
    "gap": "md",
    "columns": 12
  },
  "typography": {
    "headingFont": "Inter",
    "bodyFont": "Inter",
    "baseSize": 16,
    "scaleRatio": 1.25
  },
  "colors": {
    "primary": "#2563eb",
    "secondary": "#16a34a",
    "accent": "#f59e0b",
    "background": "#ffffff",
    "text": "#1f2937"
  },
  "effects": {
    "animations": true,
    "parallax": false,
    "fadeIn": true,
    "smoothScroll": true
  },
  "advanced": {
    "customCSS": "",
    "customJS": "",
    "metaTags": "",
    "customClasses": ""
  }
}'::JSONB;

-- Create function to update page customization
CREATE OR REPLACE FUNCTION update_page_customization(
    _page_id UUID,
    _customization JSONB
) RETURNS void AS $$
BEGIN
    UPDATE pages
    SET 
        customization = _customization,
        updated_at = NOW()
    WHERE id = _page_id;

    -- Log the activity
    INSERT INTO admin_activity (
        user_id,
        action,
        resource_type,
        resource_id,
        details
    ) VALUES (
        auth.uid(),
        'update',
        'page_customization',
        _page_id,
        jsonb_build_object(
            'customization', _customization
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get page customization
CREATE OR REPLACE FUNCTION get_page_customization(
    _page_id UUID
) RETURNS JSONB AS $$
BEGIN
    RETURN (
        SELECT customization
        FROM pages
        WHERE id = _page_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 