"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  addFolder,
  addLink,
  FOLDERS_TAG,
  hasFolder,
  hasFolderName,
  LINKS_TAG,
  removeFolder,
  renameFolder as renameFolderData,
} from "@/lib/mock-data";
import { fetchOpenGraph, parseHttpUrl, type OpenGraph } from "@/lib/open-graph";

export type FolderActionState = {
  ok: boolean;
  error?: string;
};

export type LinkActionState = {
  error?: string;
  url?: string;
  folderId?: string;
  attempt?: number;
};

export async function createLink(
  _prevState: LinkActionState,
  formData: FormData,
): Promise<LinkActionState> {
  const rawUrl = String(formData.get("url") ?? "").trim();
  const rawFolderId = String(formData.get("folderId") ?? "");
  const folderId = Number(rawFolderId);
  // 실패 시 입력값을 되돌려 폼이 비워지지 않게 한다.
  const fail = (error: string) => ({ error, url: rawUrl, folderId: rawFolderId });

  const target = parseHttpUrl(rawUrl);
  if (!target) {
    return fail("올바른 링크 주소를 입력해주세요.");
  }
  if (!Number.isInteger(folderId) || !hasFolder(folderId)) {
    return fail("폴더를 선택해주세요.");
  }

  let og: OpenGraph;
  try {
    og = await fetchOpenGraph(target);
  } catch {
    return fail("링크 정보를 가져오지 못했어요. 주소를 확인해주세요.");
  }

  addLink({
    title: og.title,
    description: og.description,
    image: og.image,
    url: og.url,
    folderId,
  });
  updateTag(LINKS_TAG);
  redirect(`/folder/${folderId}`);
}

const MAX_FOLDER_NAME_LENGTH = 20;

export async function createFolder(
  _prevState: FolderActionState,
  formData: FormData,
): Promise<FolderActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const error = validateFolderName(name);
  if (error) {
    return { ok: false, error };
  }

  addFolder(name);
  updateTag(FOLDERS_TAG);
  return { ok: true };
}

export async function renameFolder(
  _prevState: FolderActionState,
  formData: FormData,
): Promise<FolderActionState> {
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const error = validateFolderName(name, id);
  if (error) {
    return { ok: false, error };
  }

  if (!Number.isInteger(id) || !renameFolderData(id, name)) {
    return { ok: false, error: "이미 삭제되었거나 없는 폴더예요." };
  }

  updateTag(FOLDERS_TAG);
  return { ok: true };
}

function validateFolderName(name: string, excludeId?: number): string | undefined {
  if (!name) {
    return "폴더 이름을 입력해주세요.";
  }
  if (name.length > MAX_FOLDER_NAME_LENGTH) {
    return `폴더 이름은 ${MAX_FOLDER_NAME_LENGTH}자 이하로 입력해주세요.`;
  }
  if (hasFolderName(name, excludeId)) {
    return "이미 같은 이름의 폴더가 있어요.";
  }
}

export async function deleteFolder(
  _prevState: FolderActionState,
  formData: FormData,
): Promise<FolderActionState> {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || !removeFolder(id)) {
    return { ok: false, error: "이미 삭제되었거나 없는 폴더예요." };
  }

  updateTag(FOLDERS_TAG);
  updateTag(LINKS_TAG);
  return { ok: true };
}
