"use server";

import { updateTag } from "next/cache";
import {
  addFolder,
  addLink,
  FOLDERS_TAG,
  hasFolder,
  hasFolderName,
  LINKS_TAG,
  removeFolder,
  removeLink,
  renameFolder as renameFolderData,
  updateLink as updateLinkData,
} from "@/lib/mock-data";
import { fetchOpenGraph, parseHttpUrl, type OpenGraph } from "@/lib/open-graph";

export type FolderActionState = {
  ok: boolean;
  error?: string;
};

export type LinkActionState = {
  ok?: boolean;
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
  try {
    if (!Number.isInteger(folderId) || !(await hasFolder(folderId))) {
      return fail("폴더를 선택해주세요.");
    }
  } catch {
    return fail("링크를 추가하지 못했어요. 잠시 후 다시 시도해주세요.");
  }

  let og: OpenGraph;
  try {
    og = await fetchOpenGraph(target);
  } catch {
    return fail("링크 정보를 가져오지 못했어요. 주소를 확인해주세요.");
  }

  try {
    await addLink({
      title: og.title,
      description: og.description,
      image: og.image,
      url: og.url,
      folderId,
    });
  } catch {
    return fail("링크를 추가하지 못했어요. 잠시 후 다시 시도해주세요.");
  }
  updateTag(LINKS_TAG);
  return { ok: true, folderId: rawFolderId };
}

export type EditLinkActionState = {
  ok: boolean;
  error?: string;
  title?: string;
  description?: string;
  folderId?: string;
  attempt?: number;
};

const MAX_LINK_TITLE_LENGTH = 200;
const MAX_LINK_DESCRIPTION_LENGTH = 1000;

export async function updateLink(
  _prevState: EditLinkActionState,
  formData: FormData,
): Promise<EditLinkActionState> {
  const id = Number(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const rawFolderId = String(formData.get("folderId") ?? "");
  const folderId = Number(rawFolderId);
  // 실패 시 입력값을 되돌려 폼이 비워지지 않게 한다.
  const fail = (error: string) => ({ ok: false, error, title, description, folderId: rawFolderId });

  if (!title) {
    return fail("제목을 입력해주세요.");
  }
  if (title.length > MAX_LINK_TITLE_LENGTH) {
    return fail(`제목은 ${MAX_LINK_TITLE_LENGTH}자 이하로 입력해주세요.`);
  }
  if (description.length > MAX_LINK_DESCRIPTION_LENGTH) {
    return fail(`설명은 ${MAX_LINK_DESCRIPTION_LENGTH}자 이하로 입력해주세요.`);
  }
  try {
    if (!Number.isInteger(folderId) || !(await hasFolder(folderId))) {
      return fail("폴더를 선택해주세요.");
    }
    if (!Number.isInteger(id) || !(await updateLinkData(id, { title, description, folderId }))) {
      return fail("이미 삭제되었거나 없는 링크예요.");
    }
  } catch {
    return fail("링크를 수정하지 못했어요. 잠시 후 다시 시도해주세요.");
  }

  updateTag(LINKS_TAG);
  return { ok: true };
}

export async function deleteLink(
  _prevState: FolderActionState,
  formData: FormData,
): Promise<FolderActionState> {
  const id = Number(formData.get("id"));

  try {
    if (!Number.isInteger(id) || !(await removeLink(id))) {
      return { ok: false, error: "이미 삭제되었거나 없는 링크예요." };
    }
  } catch {
    return { ok: false, error: "링크를 삭제하지 못했어요. 잠시 후 다시 시도해주세요." };
  }

  updateTag(LINKS_TAG);
  return { ok: true };
}

const MAX_FOLDER_NAME_LENGTH = 20;

export async function createFolder(
  _prevState: FolderActionState,
  formData: FormData,
): Promise<FolderActionState> {
  const name = String(formData.get("name") ?? "").trim();
  try {
    const error = await validateFolderName(name);
    if (error) {
      return { ok: false, error };
    }

    await addFolder(name);
  } catch {
    return { ok: false, error: "폴더를 추가하지 못했어요. 잠시 후 다시 시도해주세요." };
  }
  updateTag(FOLDERS_TAG);
  return { ok: true };
}

export async function renameFolder(
  _prevState: FolderActionState,
  formData: FormData,
): Promise<FolderActionState> {
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  try {
    const error = await validateFolderName(name, id);
    if (error) {
      return { ok: false, error };
    }

    if (!Number.isInteger(id) || !(await renameFolderData(id, name))) {
      return { ok: false, error: "이미 삭제되었거나 없는 폴더예요." };
    }
  } catch {
    return { ok: false, error: "폴더 이름을 수정하지 못했어요. 잠시 후 다시 시도해주세요." };
  }

  updateTag(FOLDERS_TAG);
  return { ok: true };
}

async function validateFolderName(
  name: string,
  excludeId?: number,
): Promise<string | undefined> {
  if (!name) {
    return "폴더 이름을 입력해주세요.";
  }
  if (name.length > MAX_FOLDER_NAME_LENGTH) {
    return `폴더 이름은 ${MAX_FOLDER_NAME_LENGTH}자 이하로 입력해주세요.`;
  }
  if (await hasFolderName(name, excludeId)) {
    return "이미 같은 이름의 폴더가 있어요.";
  }
}

export async function deleteFolder(
  _prevState: FolderActionState,
  formData: FormData,
): Promise<FolderActionState> {
  const id = Number(formData.get("id"));

  try {
    if (!Number.isInteger(id) || !(await removeFolder(id))) {
      return { ok: false, error: "이미 삭제되었거나 없는 폴더예요." };
    }
  } catch {
    return { ok: false, error: "폴더를 삭제하지 못했어요. 잠시 후 다시 시도해주세요." };
  }

  updateTag(FOLDERS_TAG);
  updateTag(LINKS_TAG);
  return { ok: true };
}
