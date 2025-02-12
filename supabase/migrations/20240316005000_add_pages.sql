-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    sections JSONB NOT NULL DEFAULT '[]',
    meta JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    status TEXT CHECK (status IN ('draft', 'published', 'archived')),
    author_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create page_revisions table for version control
CREATE TABLE IF NOT EXISTS page_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    sections JSONB NOT NULL,
    meta JSONB NOT NULL,
    settings JSONB NOT NULL,
    author_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_revisions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Published pages are viewable by everyone"
    ON pages FOR SELECT
    USING (status = 'published');

CREATE POLICY "Only admins can manage pages"
    ON pages FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can manage page revisions"
    ON page_revisions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create indexes
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_page_revisions_page ON page_revisions(page_id);

-- Add trigger for updated_at
CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Insert default pages
INSERT INTO pages (title, slug, description, sections, meta, settings, status)
VALUES
    (
        'Home',
        '/',
        'Welcome to EriEthio Research',
        '[
            {
                "id": "hero",
                "type": "hero",
                "content": {
                    "title": "EriEthio Research",
                    "subtitle": "Advancing Research & Innovation",
                    "buttons": [
                        {
                            "text": "Explore Research",
                            "href": "/research",
                            "variant": "primary"
                        },
                        {
                            "text": "View Projects",
                            "href": "/projects",
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
                    "title": "Our Features",
                    "items": [
                        {
                            "icon": "Beaker",
                            "title": "Research Excellence",
                            "description": "Cutting-edge research methodologies and tools"
                        },
                        {
                            "icon": "BookOpen",
                            "title": "Knowledge Hub",
                            "description": "Comprehensive database of research papers and findings"
                        },
                        {
                            "icon": "Users",
                            "title": "Collaboration",
                            "description": "Connect with researchers and institutions"
                        },
                        {
                            "icon": "Lightbulb",
                            "title": "Innovation",
                            "description": "Transforming research into practical solutions"
                        }
                    ]
                },
                "settings": {
                    "columns": 4,
                    "gap": "lg",
                    "padding": "lg"
                }
            },
            {
                "id": "featured-research",
                "type": "cards",
                "content": {
                    "title": "Featured Research",
                    "items": [
                        {
                            "title": "AI in Healthcare",
                            "subtitle": "Machine Learning Applications",
                            "summary": "Exploring innovative applications of artificial intelligence in healthcare diagnostics and treatment planning.",
                            "tags": ["AI", "Healthcare", "ML"],
                            "gradient": { "from": "#00ff9d", "to": "#00ccff" }
                        },
                        {
                            "title": "Sustainable Energy",
                            "subtitle": "Renewable Resources",
                            "summary": "Research into next-generation sustainable energy solutions and their environmental impact.",
                            "tags": ["Energy", "Sustainability", "Climate"],
                            "gradient": { "from": "#ff2079", "to": "#ff9d00" }
                        },
                        {
                            "title": "Quantum Computing",
                            "subtitle": "Next-Gen Technology",
                            "summary": "Investigating quantum computing applications in cryptography and complex system simulation.",
                            "tags": ["Quantum", "Computing", "Technology"],
                            "gradient": { "from": "#7928ca", "to": "#ff0080" }
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
        '{"title": "EriEthio Research - Home", "description": "Research and Innovation Hub"}',
        '{"layout": "default", "theme": "dark"}',
        'published'
    ),
    (
        'Products',
        '/products',
        'Our Products and Solutions',
        '[
            {
                "id": "hero",
                "type": "hero",
                "content": {
                    "title": "Our Products",
                    "subtitle": "Discover our cutting-edge research tools and solutions",
                    "buttons": [
                        {
                            "text": "Browse Products",
                            "href": "#products",
                            "variant": "primary"
                        }
                    ]
                },
                "settings": {
                    "align": "center",
                    "fullWidth": true,
                    "background": "gradient"
                }
            }
        ]',
        '{"title": "EriEthio Research - Products", "description": "Research Tools and Solutions"}',
        '{"layout": "default", "theme": "dark"}',
        'published'
    ),
    (
        'Research',
        '/research',
        'Research Projects and Publications',
        '[
            {
                "id": "hero",
                "type": "hero",
                "content": {
                    "title": "Research Hub",
                    "subtitle": "Explore our research projects, publications, and collaborations",
                    "buttons": [
                        {
                            "text": "View Projects",
                            "href": "#projects",
                            "variant": "primary"
                        }
                    ]
                },
                "settings": {
                    "align": "center",
                    "fullWidth": true,
                    "background": "gradient"
                }
            }
        ]',
        '{"title": "EriEthio Research - Research", "description": "Research Projects and Publications"}',
        '{"layout": "default", "theme": "dark"}',
        'published'
    ); 