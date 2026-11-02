-- links, folders 테이블에 RLS(행 단위 보안)를 켜고, 로그인한 사용자가 자기 데이터만 다루게 한다.
-- - 생성: 로그인한 사용자만, 자기 아이디(user_id = auth.uid())로만 만들 수 있다.
-- - 조회/수정/삭제: user_id가 자기 아이디인 행만 대상이 된다.
-- - user_id 값은 수정할 수 없다. (UPDATE 권한을 user_id를 뺀 컬럼에만 준다)
-- 정책은 authenticated 역할에만 걸어서, 로그인하지 않은(anon) 요청은 아무 행도 다룰 수 없다.
-- auth.uid()를 (select auth.uid())로 감싸 행마다 다시 계산하지 않게 한다.

-- folders ------------------------------------------------------------------
alter table public.folders enable row level security;

create policy "folders_insert_own" on public.folders
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "folders_select_own" on public.folders
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "folders_update_own" on public.folders
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "folders_delete_own" on public.folders
  for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke update on public.folders from anon, authenticated;
grant update (name) on public.folders to authenticated;

-- links --------------------------------------------------------------------
alter table public.links enable row level security;

create policy "links_insert_own" on public.links
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "links_select_own" on public.links
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "links_update_own" on public.links
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "links_delete_own" on public.links
  for delete to authenticated
  using ((select auth.uid()) = user_id);

revoke update on public.links from anon, authenticated;
grant update (url, title, description, thumbnail_url, folder_id) on public.links to authenticated;
