-- TeachFlow application schema. Identity tables come from 0001_auth.sql.
-- Per-user rows use user_id text and are always filtered by the signed-in user.

create table if not exists profiles (
  user_id text primary key references "user" ("id") on delete cascade,
  full_name text not null default '',
  institution text not null default '',
  department text not null default '',
  designation text not null default '',
  subjects text not null default '',
  grades text not null default '',
  timezone text not null default 'UTC',
  work_start text not null default '08:00',
  work_end text not null default '16:00',
  quiet_start text not null default '21:00',
  quiet_end text not null default '07:00',
  reminder_lead_minutes integer not null default 60,
  reminders_enabled boolean not null default true,
  doc_note text not null default '',
  recovery_code_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tasks (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  title text not null,
  description text not null default '',
  category text not null default 'other',
  priority text not null default 'normal',
  status text not null default 'open',
  due_date date,
  due_time text,
  estimated_minutes integer,
  actual_minutes integer,
  notes text not null default '',
  calendar_event_id text,
  template_id text,
  remind boolean not null default true,
  reminder_lead_minutes integer,
  version integer not null default 1,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_due_idx on tasks (user_id, status, due_date);
create index if not exists tasks_user_updated_idx on tasks (user_id, updated_at desc);

create table if not exists subtasks (
  id text primary key,
  task_id text not null references tasks (id) on delete cascade,
  user_id text not null references "user" ("id") on delete cascade,
  title text not null,
  done boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists subtasks_task_idx on subtasks (task_id, sort_order);

create table if not exists calendar_events (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  title text not null,
  description text not null default '',
  kind text not null default 'academic',
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean not null default false,
  recurrence text not null default 'none',
  recurrence_until date,
  task_id text,
  version integer not null default 1,
  remind boolean not null default false,
  reminder_lead_minutes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_user_start_idx on calendar_events (user_id, starts_at);

do $$ begin
  alter table tasks
    add constraint tasks_event_fk
    foreign key (calendar_event_id) references calendar_events (id) on delete set null;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table calendar_events
    add constraint events_task_fk
    foreign key (task_id) references tasks (id) on delete set null;
exception when duplicate_object then null;
end $$;

create table if not exists templates (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  name text not null,
  description text not null default '',
  category text not null default 'other',
  subject text not null default '',
  grade_level text not null default '',
  status text not null default 'needs_review',
  current_version_id text,
  manual_minutes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists templates_user_idx on templates (user_id, updated_at desc);

do $$ begin
  alter table tasks
    add constraint tasks_template_fk
    foreign key (template_id) references templates (id) on delete set null;
exception when duplicate_object then null;
end $$;

create table if not exists template_versions (
  id text primary key,
  template_id text not null references templates (id) on delete cascade,
  user_id text not null references "user" ("id") on delete cascade,
  version integer not null,
  original_filename text not null,
  format text not null,
  byte_size integer not null,
  checksum text not null,
  file_b64 text not null,
  schema_json text not null default '[]',
  analysis_json text not null default '{}',
  processing_status text not null default 'needs_review',
  created_at timestamptz not null default now(),
  unique (template_id, version)
);

create index if not exists template_versions_lookup_idx on template_versions (template_id, version desc);

create table if not exists generated_documents (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  template_id text references templates (id) on delete set null,
  template_version_id text,
  task_id text references tasks (id) on delete set null,
  filename text not null,
  format text not null,
  file_b64 text,
  status text not null,
  validation_note text not null default '',
  form_json text not null default '{}',
  error text,
  created_at timestamptz not null default now()
);

create index if not exists documents_user_idx on generated_documents (user_id, created_at desc);
create index if not exists documents_task_idx on generated_documents (task_id);

create table if not exists reminders (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  task_id text references tasks (id) on delete cascade,
  event_id text references calendar_events (id) on delete cascade,
  fire_at timestamptz not null,
  status text not null default 'scheduled',
  lead_minutes integer not null,
  idempotency_key text not null,
  attempt_count integer not null default 0,
  last_error text,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, idempotency_key)
);

create index if not exists reminders_due_idx on reminders (user_id, status, fire_at);

create table if not exists notifications (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  kind text not null,
  title text not null,
  body text not null default '',
  href text,
  reminder_id text,
  read_at timestamptz,
  idempotency_key text,
  created_at timestamptz not null default now(),
  unique (user_id, idempotency_key)
);

create index if not exists notifications_user_idx on notifications (user_id, created_at desc);

create table if not exists recovery_attempts (
  email text primary key,
  fails integer not null default 0,
  locked_until timestamptz
);
