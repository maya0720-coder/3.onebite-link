export default function FolderSkeleton() {
  return (
    <section aria-busy="true" aria-label="불러오는 중">
      <div className="mb-6 h-[34px] w-32 animate-pulse rounded-lg bg-[var(--disabled)]" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-[140px] animate-pulse rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-card)]"
          />
        ))}
      </div>
    </section>
  );
}
