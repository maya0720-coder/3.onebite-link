type LinkUrlInputProps = {
  defaultValue?: string;
};

export default function LinkUrlInput({ defaultValue }: LinkUrlInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="url" className="text-sm font-medium text-[var(--text-sub)]">
        링크
      </label>
      <input
        id="url"
        name="url"
        type="url"
        required
        defaultValue={defaultValue}
        autoComplete="off"
        placeholder="https://example.com"
        className="field rounded-xl bg-[var(--bg)] px-4 py-3.5 text-[17px] text-[var(--text)] outline-none"
      />
    </div>
  );
}
