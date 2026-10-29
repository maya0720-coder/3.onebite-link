type CancelButtonProps = {
  popoverTarget: string;
};

export default function CancelButton({ popoverTarget }: CancelButtonProps) {
  return (
    <button
      type="button"
      popoverTarget={popoverTarget}
      popoverTargetAction="hide"
      className="btn-secondary w-full cursor-pointer rounded-xl bg-[var(--accent-soft)] px-5 py-3.5 text-[17px] font-bold text-[var(--accent)]"
    >
      취소
    </button>
  );
}
