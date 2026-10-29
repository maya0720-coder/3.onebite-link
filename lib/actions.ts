"use server";

import { updateTag } from "next/cache";
import { addFolder, FOLDERS_TAG, hasFolderName } from "@/lib/mock-data";

export type CreateFolderState = {
  ok: boolean;
  error?: string;
};

const MAX_FOLDER_NAME_LENGTH = 20;

export async function createFolder(
  _prevState: CreateFolderState,
  formData: FormData,
): Promise<CreateFolderState> {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return { ok: false, error: "폴더 이름을 입력해주세요." };
  }
  if (name.length > MAX_FOLDER_NAME_LENGTH) {
    return {
      ok: false,
      error: `폴더 이름은 ${MAX_FOLDER_NAME_LENGTH}자 이하로 입력해주세요.`,
    };
  }
  if (hasFolderName(name)) {
    return { ok: false, error: "이미 같은 이름의 폴더가 있어요." };
  }

  addFolder(name);
  updateTag(FOLDERS_TAG);
  return { ok: true };
}
