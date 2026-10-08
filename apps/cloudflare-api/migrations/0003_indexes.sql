CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured, created_at);
CREATE INDEX IF NOT EXISTS idx_posts_slug_active ON posts(slug) WHERE deleted_at IS NULL;
