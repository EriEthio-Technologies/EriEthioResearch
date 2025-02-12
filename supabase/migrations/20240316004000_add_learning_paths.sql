-- Create podcasts table
CREATE TABLE IF NOT EXISTS podcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    thumbnail TEXT,
    duration TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id),
    category TEXT NOT NULL,
    tags TEXT[],
    transcript TEXT,
    status TEXT CHECK (status IN ('draft', 'published', 'archived')),
    requires_auth BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create learning_paths table
CREATE TABLE IF NOT EXISTS learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail TEXT,
    author_id UUID REFERENCES profiles(id),
    is_official BOOLEAN DEFAULT false,
    subscription_required BOOLEAN DEFAULT false,
    price DECIMAL(10,2),
    estimated_duration TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    prerequisites TEXT[],
    learning_objectives TEXT[],
    status TEXT CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create learning_path_items table
CREATE TABLE IF NOT EXISTS learning_path_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
    item_type TEXT CHECK (item_type IN ('course', 'podcast', 'assignment', 'quiz')),
    item_id UUID NOT NULL,
    order_index INTEGER NOT NULL,
    required BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_learning_paths table
CREATE TABLE IF NOT EXISTS user_learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'dropped')),
    progress JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, path_id)
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    starter_code TEXT,
    solution_code TEXT,
    test_cases JSONB,
    time_limit INTEGER, -- in minutes
    points INTEGER DEFAULT 0,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    tags TEXT[],
    requires_review BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_assignments table
CREATE TABLE IF NOT EXISTS user_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    submission_code TEXT,
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'submitted', 'graded')),
    grade INTEGER,
    feedback TEXT,
    reviewer_id UUID REFERENCES profiles(id),
    test_results JSONB,
    submitted_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, assignment_id)
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    criteria JSONB NOT NULL,
    category TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    shared_at TIMESTAMPTZ,
    UNIQUE(user_id, badge_id)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT CHECK (type IN ('course', 'learning_path', 'achievement')),
    reference_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    verification_code TEXT UNIQUE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'canceled', 'expired')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    payment_provider TEXT NOT NULL,
    payment_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Podcasts policies
CREATE POLICY "Public podcasts are viewable by everyone"
    ON podcasts FOR SELECT
    USING (status = 'published' AND NOT requires_auth);

CREATE POLICY "Premium podcasts are viewable by authenticated users"
    ON podcasts FOR SELECT
    USING (
        status = 'published' AND (
            NOT requires_auth OR
            auth.role() = 'authenticated'
        )
    );

-- Learning paths policies
CREATE POLICY "Public learning paths are viewable by everyone"
    ON learning_paths FOR SELECT
    USING (status = 'published' AND NOT subscription_required);

CREATE POLICY "Premium learning paths are viewable by subscribers"
    ON learning_paths FOR SELECT
    USING (
        status = 'published' AND (
            NOT subscription_required OR
            EXISTS (
                SELECT 1 FROM subscriptions
                WHERE user_id = auth.uid()
                AND status = 'active'
                AND (expires_at IS NULL OR expires_at > NOW())
            )
        )
    );

-- User learning paths policies
CREATE POLICY "Users can view and manage their own learning paths"
    ON user_learning_paths FOR ALL
    USING (user_id = auth.uid());

-- Assignments policies
CREATE POLICY "Users can view assignments in their learning paths"
    ON assignments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM learning_path_items lpi
            JOIN user_learning_paths ulp ON ulp.path_id = lpi.path_id
            WHERE lpi.item_type = 'assignment'
            AND lpi.item_id = assignments.id
            AND ulp.user_id = auth.uid()
        )
    );

-- User assignments policies
CREATE POLICY "Users can manage their own assignments"
    ON user_assignments FOR ALL
    USING (user_id = auth.uid());

-- Badges and certificates policies
CREATE POLICY "Badges are viewable by everyone"
    ON badges FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own badges"
    ON user_badges FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can view their own certificates"
    ON certificates FOR SELECT
    USING (user_id = auth.uid());

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions"
    ON subscriptions FOR SELECT
    USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_podcasts_status ON podcasts(status);
CREATE INDEX idx_learning_paths_status ON learning_paths(status);
CREATE INDEX idx_learning_paths_subscription ON learning_paths(subscription_required);
CREATE INDEX idx_learning_path_items_path ON learning_path_items(path_id);
CREATE INDEX idx_user_learning_paths_user ON user_learning_paths(user_id);
CREATE INDEX idx_user_learning_paths_path ON user_learning_paths(path_id);
CREATE INDEX idx_assignments_difficulty ON assignments(difficulty);
CREATE INDEX idx_user_assignments_user ON user_assignments(user_id);
CREATE INDEX idx_user_assignments_status ON user_assignments(status);
CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_verification ON certificates(verification_code);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Add triggers
CREATE TRIGGER update_podcasts_updated_at
    BEFORE UPDATE ON podcasts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_learning_paths_updated_at
    BEFORE UPDATE ON learning_paths
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_learning_path_items_updated_at
    BEFORE UPDATE ON learning_path_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_learning_paths_updated_at
    BEFORE UPDATE ON user_learning_paths
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_assignments_updated_at
    BEFORE UPDATE ON assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_assignments_updated_at
    BEFORE UPDATE ON user_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at(); 