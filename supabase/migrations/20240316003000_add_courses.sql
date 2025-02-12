-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    duration TEXT NOT NULL,
    level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    requires_auth BOOLEAN DEFAULT false,
    video_url TEXT,
    author_id UUID REFERENCES profiles(id),
    category TEXT NOT NULL,
    tags TEXT[],
    status TEXT CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course_sections table
CREATE TABLE IF NOT EXISTS course_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course_lessons table
CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID REFERENCES course_sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT CHECK (content_type IN ('video', 'text', 'quiz', 'assignment')),
    content JSONB NOT NULL,
    duration TEXT,
    order_index INTEGER NOT NULL,
    requires_auth BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course_enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('in_progress', 'completed', 'dropped')),
    progress JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(course_id, user_id)
);

-- Create course_progress table
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress INTEGER DEFAULT 0,
    last_position INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(enrollment_id, lesson_id)
);

-- Create course_reviews table
CREATE TABLE IF NOT EXISTS course_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, user_id)
);

-- Create course_categories table
CREATE TABLE IF NOT EXISTS course_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES course_categories(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add categories relationship to courses
ALTER TABLE courses ADD COLUMN category_id UUID REFERENCES course_categories(id);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Courses
CREATE POLICY "Public courses are viewable by everyone"
    ON courses FOR SELECT
    USING (status = 'published' AND NOT requires_auth);

CREATE POLICY "Premium courses are viewable by authenticated users"
    ON courses FOR SELECT
    USING (
        status = 'published' AND (
            NOT requires_auth OR
            auth.role() = 'authenticated'
        )
    );

CREATE POLICY "Authors can manage their own courses"
    ON courses FOR ALL
    USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all courses"
    ON courses FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Course sections and lessons
CREATE POLICY "Course content is viewable by enrolled users"
    ON course_sections FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM course_enrollments
            WHERE course_id = course_sections.course_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Course lessons are viewable by enrolled users"
    ON course_lessons FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM course_enrollments ce
            JOIN course_sections cs ON cs.course_id = ce.course_id
            WHERE cs.id = course_lessons.section_id
            AND ce.user_id = auth.uid()
        )
    );

-- Enrollments and progress
CREATE POLICY "Users can view their own enrollments"
    ON course_enrollments FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own progress"
    ON course_progress FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM course_enrollments
            WHERE id = course_progress.enrollment_id
            AND user_id = auth.uid()
        )
    );

-- Reviews
CREATE POLICY "Reviews are viewable by everyone"
    ON course_reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own reviews"
    ON course_reviews FOR ALL
    USING (user_id = auth.uid());

-- Categories
CREATE POLICY "Categories are viewable by everyone"
    ON course_categories FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage categories"
    ON course_categories FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create indexes
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_course_sections_course ON course_sections(course_id);
CREATE INDEX idx_course_lessons_section ON course_lessons(section_id);
CREATE INDEX idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_course_progress_enrollment ON course_progress(enrollment_id);
CREATE INDEX idx_course_progress_lesson ON course_progress(lesson_id);
CREATE INDEX idx_course_reviews_course ON course_reviews(course_id);
CREATE INDEX idx_course_reviews_user ON course_reviews(user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_course_sections_updated_at
    BEFORE UPDATE ON course_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_course_lessons_updated_at
    BEFORE UPDATE ON course_lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_course_progress_updated_at
    BEFORE UPDATE ON course_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_course_reviews_updated_at
    BEFORE UPDATE ON course_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_course_categories_updated_at
    BEFORE UPDATE ON course_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at(); 