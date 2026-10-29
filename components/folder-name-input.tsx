type FolderNameInputProps = {
  error?: string;
};

export default function FolderNameInput({ error }: FolderNameInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="name" className="text-sm font-medium text-[var(--text-sub)]">
        폴더 이름
      </label>
      <input
        id="name"
        name="name"
        type="text"
        required
        maxLength={20}
        autoComplete="off"
        placeholder="예) 즐겨찾기"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "name-error" : undefined}
        className="field rounded-xl bg-[var(--bg)] px-4 py-3.5 text-[17px] text-[var(--text)] outline-none"
      />
      {error && (
        <p id="name-error" className="text-sm text-[var(--error)]">
          {error}
        </p>
      )}
    </div>
  );
}
