interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
}

export function TextInput({ value, onChange, label, placeholder }: TextInputProps) {
  const charCount = value.length;

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-800">
          {label}
        </label>
        {charCount > 0 && (
          <span className="text-xs tabular-nums text-gray-400 transition-colors">
            {charCount.toLocaleString()} chars
          </span>
        )}
      </div>
      <div className="relative flex-1">
        <textarea
          className="h-full w-full rounded-lg border border-gray-200 bg-gray-50/50
            px-4 py-3 font-mono text-sm leading-relaxed text-gray-800
            placeholder:text-gray-400
            hover:border-gray-300 hover:bg-white
            focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20 focus:outline-none
            resize-none min-h-[200px] md:min-h-[400px]
            shadow-sm transition-all duration-200"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={label}
        />
      </div>
    </div>
  );
}
