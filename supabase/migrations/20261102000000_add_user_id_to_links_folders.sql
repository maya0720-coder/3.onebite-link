-- links, folders 테이블에 user_id 컬럼 추가
-- 1) 기존 데이터를 모두 지운다. (user_id를 필수로 만들기 위해 주인이 없는 행을 남기지 않는다)
-- 2) user_id는 요청을 보낸 로그인 사용자(auth.uid())로 자동 입력되고, 비어 있을 수 없다.
-- 3) 사용자 계정이 삭제되면 그 사용자의 폴더와 링크도 함께 지워진다.

begin;

delete from public.links;
delete from public.folders;

alter table public.folders
  add column user_id uuid not null default auth.uid()
  references auth.users (id) on delete cascade;

alter table public.links
  add column user_id uuid not null default auth.uid()
  references auth.users (id) on delete cascade;

create index folders_user_id_idx on public.folders (user_id);
create index links_user_id_idx on public.links (user_id);

commit;
