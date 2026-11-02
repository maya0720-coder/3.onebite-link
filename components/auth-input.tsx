type AuthInputProps = {
  id: string;
  label: string;
  type: "email" | "password";
  placeholder: string;
  autoComplete: string;
  value?: string;
  onChange?: (value: string) => void;
};

export default function AuthInput({
  id,
  label,
  type,
  placeholder,
  autoComplete,
  value,
  onChange,
}: AuthInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-[var(--text-sub)]">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange && ((event) => onChange(event.target.value))}
        className="field rounded-xl bg-[var(--bg)] px-4 py-3.5 text-[17px] text-[var(--text)] outline-none"
      />
    </div>
  );
}
