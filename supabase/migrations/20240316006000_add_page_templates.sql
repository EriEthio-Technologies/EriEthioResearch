-- Create page_templates table
CREATE TABLE IF NOT EXISTS page_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    sections JSONB NOT NULL DEFAULT '[]',
    meta JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    author_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE page_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Page templates are viewable by authenticated users"
    ON page_templates FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can manage page templates"
    ON page_templates FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create indexes
CREATE INDEX idx_page_templates_author ON page_templates(author_id);

-- Add trigger for updated_at
CREATE TRIGGER update_page_templates_updated_at
    BEFORE UPDATE ON page_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Insert default templates
INSERT INTO page_templates (name, description, sections, meta, settings)
VALUES
    (
        'Landing Page',
        'A standard landing page template with hero section, features, and call to action',
        '[
            {
                "id": "hero",
                "type": "hero",
                "content": {
                    "title": "Welcome",
                    "subtitle": "Add your subtitle here",
                    "buttons": [
                        {
                            "text": "Get Started",
                            "href": "#",
                            "variant": "primary"
                        },
                        {
                            "text": "Learn More",
                            "href": "#",
                            "variant": "secondary"
                        }
                    ]
                },
                "settings": {
                    "align": "center",
                    "fullWidth": true,
                    "background": "gradient"
                }
            },
            {
                "id": "features",
                "type": "grid",
                "content": {
                    "title": "Features",
                    "items": [
                        {
                            "icon": "Star",
                            "title": "Feature 1",
                            "description": "Description for feature 1"
                        },
                        {
                            "icon": "Heart",
                            "title": "Feature 2",
                            "description": "Description for feature 2"
                        },
                        {
                            "icon": "Zap",
                            "title": "Feature 3",
                            "description": "Description for feature 3"
                        }
                    ]
                },
                "settings": {
                    "columns": 3,
                    "gap": "lg",
                    "padding": "lg"
                }
            }
        ]',
        '{"title": "Landing Page", "description": "A beautiful landing page"}',
        '{"layout": "default", "theme": "dark"}'
    ),
    (
        'Blog Post',
        'A template for blog posts with header image and content sections',
        '[
            {
                "id": "header",
                "type": "hero",
                "content": {
                    "title": "Blog Post Title",
                    "subtitle": "Add your subtitle here"
                },
                "settings": {
                    "align": "center",
                    "fullWidth": true,
                    "background": "image"
                }
            },
            {
                "id": "content",
                "type": "text",
                "content": {
                    "text": "<p>Add your blog post content here...</p>"
                },
                "settings": {
                    "padding": "lg",
                    "alignment": "left"
                }
            }
        ]',
        '{"title": "Blog Post", "description": "A blog post template"}',
        '{"layout": "default", "theme": "dark"}'
    ),
    (
        'Documentation',
        'A template for documentation pages with sidebar navigation',
        '[
            {
                "id": "content",
                "type": "text",
                "content": {
                    "text": "<h1>Documentation</h1><p>Add your documentation content here...</p>"
                },
                "settings": {
                    "padding": "lg",
                    "alignment": "left"
                }
            }
        ]',
        '{"title": "Documentation", "description": "A documentation page"}',
        '{"layout": "sidebar", "theme": "dark"}'
    ); 