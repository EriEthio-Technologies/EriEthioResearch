create table content (
  id uuid primary key default uuid_generate_v4(),
  type varchar(20) not null,
  title varchar(255) not null,
  slug varchar(255) unique not null,
  description text,
  content text not null,
  featured_image varchar(255),
  tags varchar(255)[],
  published_at timestamp with time zone,
  author_id uuid references profiles(id),
  status varchar(20) default 'draft',
  metadata jsonb
);

-- Add indexes
create index idx_content_type on content (type);
create index idx_content_status on content (status);
create index idx_content_author on content (author_id); 