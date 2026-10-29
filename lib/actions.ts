"use server";

import { updateTag } from "next/cache";
import {
  addFolder,
  FOLDERS_TAG,
  hasFolderName,
  LINKS_TAG,
  removeFolder,
  renameFolder as renameFolderData,
} from "@/lib/mock-data";

export type FolderActionState = {
  ok: boolean;
  error?: string;
};

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
