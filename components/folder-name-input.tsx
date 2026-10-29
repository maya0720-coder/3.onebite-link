type FolderNameInputProps = {
  id?: string;
  defaultValue?: string;
  error?: string;
};

export default function FolderNameInput({ id = "name", defaultValue, error }: FolderNameInputProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-[var(--text-sub)]">
        폴더 이름
      </label>
      <input
        id={id}
        name="name"
        type="text"
        required
        maxLength={20}
        defaultValue={defaultValue}
        autoComplete="off"
        placeholder="예) 즐겨찾기"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="field rounded-xl bg-[var(--bg)] px-4 py-3.5 text-[17px] text-[var(--text)] outline-none"
      />
      {error && (
        <p id={errorId} className="text-sm text-[var(--error)]">
          {error}
        </p>
      )}
    </div>
  );
}
