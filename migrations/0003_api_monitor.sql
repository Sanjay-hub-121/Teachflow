create table if not exists assistant_api_usage (
  id text primary key,
  user_id text not null references "user" ("id") on delete cascade,
  provider text not null,
  model text not null,
  total_tokens integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists assistant_api_usage_user_created_idx
  on assistant_api_usage (user_id, created_at desc);
