-- Reviews (testimonials) managed via the admin panel. Run when Supabase is connected.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  company text not null default '',
  quote text not null,
  status text not null default 'published' check (status in ('draft','published')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
create policy "public read published reviews" on public.reviews for select using (status = 'published');
create policy "admins manage reviews" on public.reviews for all using (public.is_admin()) with check (public.is_admin());
create trigger reviews_touch before update on public.reviews for each row execute function public.touch_updated_at();

insert into public.reviews (author, company, quote, sort_order) values
('Kimberley','Camelot Beach Hotel','Fantastic. Very easy to work with. Takes on board your ideas and enhances it to create true works of art. Incredibly patient and attentive to details.',1),
('Gwen','Living Heritage Koslanda','The quality of the work was superb, the turn around very fast and he really listened and understood the brief so that the portfolio of photographs we ended up with was just spot on.',2),
('Swanthri','','Easily the best experience with a photographer to date. He made sure everyone was very comfortable and enjoyed the experience. Looking forward to work with him more!',3),
('Shabna','Resplendent Ceylon','We have found his level of efficiency and professionalism, personality and eye for detail to be highly admirable. Would recommend and look forward to many more collaborations to come.',4),
('Raffael','Soul & Surf Ahangama','Excellent work. Shak nailed the brief and was a pleasure to work with. We can''t wait to work with him again.',5);
