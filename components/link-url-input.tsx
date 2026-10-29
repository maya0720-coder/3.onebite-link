export default function LinkUrlInput() {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="url" className="text-sm font-medium text-zinc-700">
        링크
      </label>
      <input
        id="url"
        name="url"
        type="url"
        required
        placeholder="https://example.com"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
      />
    </div>
  );
}
