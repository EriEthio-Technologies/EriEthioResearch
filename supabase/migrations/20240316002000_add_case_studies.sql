-- Create case_studies table
CREATE TABLE IF NOT EXISTS case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    challenge TEXT NOT NULL,
    solution TEXT NOT NULL,
    results TEXT NOT NULL,
    featured_image TEXT,
    gallery_images TEXT[],
    technologies TEXT[],
    testimonials JSONB[],
    status TEXT CHECK (status IN ('draft', 'published', 'archived')),
    author_id UUID REFERENCES profiles(id),
    published_at TIMESTAMPTZ,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create case_study_metrics table
CREATE TABLE IF NOT EXISTS case_study_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_study_id UUID REFERENCES case_studies(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value TEXT NOT NULL,
    metric_type TEXT CHECK (metric_type IN ('percentage', 'number', 'currency', 'text')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create case_study_related_research table
CREATE TABLE IF NOT EXISTS case_study_related_research (
    case_study_id UUID REFERENCES case_studies(id) ON DELETE CASCADE,
    research_project_id UUID REFERENCES research_projects(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (case_study_id, research_project_id)
);

-- Enable RLS
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_study_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_study_related_research ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Published case studies are viewable by everyone"
    ON case_studies FOR SELECT
    USING (status = 'published');

CREATE POLICY "Authors can manage their own case studies"
    ON case_studies FOR ALL
    USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all case studies"
    ON case_studies FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Case study metrics are viewable with case study"
    ON case_study_metrics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM case_studies
            WHERE id = case_study_metrics.case_study_id
            AND status = 'published'
        )
    );

CREATE POLICY "Only admins can manage metrics"
    ON case_study_metrics FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create indexes
CREATE INDEX idx_case_studies_status ON case_studies(status);
CREATE INDEX idx_case_studies_author ON case_studies(author_id);
CREATE INDEX idx_case_studies_industry ON case_studies(industry);
CREATE INDEX idx_case_study_metrics_case_study ON case_study_metrics(case_study_id);

-- Add triggers for updated_at
CREATE TRIGGER update_case_studies_updated_at
    BEFORE UPDATE ON case_studies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_case_study_metrics_updated_at
    BEFORE UPDATE ON case_study_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at(); 