import type {
  ChangeEventHandler,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";

type SharedFieldProps = {
  label: string;
  error?: string;
  wrapperClassName?: string;
  fieldClassName?: string;
};

type TextFieldProps = SharedFieldProps &
  InputHTMLAttributes<HTMLInputElement>;

type SelectFieldProps = SharedFieldProps &
  SelectHTMLAttributes<HTMLSelectElement>;

type TextAreaFieldProps = SharedFieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

type PhoneFieldProps = SharedFieldProps & {
  phoneValue: string;
  phonePlaceholder: string;
  phoneMaxLength: number;
  onPhoneChange: ChangeEventHandler<HTMLInputElement>;
  inputName?: string;
  inputClassName?: string;
};

type DateFieldProps = SharedFieldProps &
  InputHTMLAttributes<HTMLInputElement> & {
    placeholderText?: string;
    locale?: string;
  };

function cx(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

function formatDateDisplay(
  value: InputHTMLAttributes<HTMLInputElement>["value"],
  placeholderText = "Оберіть дату",
  locale = "uk-UA"
) {
  if (typeof value !== "string" || !value) {
    return placeholderText;
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return placeholderText;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(parsedDate);
}

function FieldError({ error }: { error?: string }) {
  if (!error) {
    return null;
  }

  return <span className="field-error">{error}</span>;
}

export function TextField({
  label,
  error,
  wrapperClassName,
  fieldClassName,
  className,
  ...props
}: TextFieldProps) {
  return (
    <label className={cx("field-group", wrapperClassName, className)}>
      <span className="field-label">{label}</span>
      <input
        {...props}
        className={cx("field-lux", error && "is-invalid", fieldClassName)}
      />
      <FieldError error={error} />
    </label>
  );
}

export function SelectField({
  label,
  error,
  wrapperClassName,
  fieldClassName,
  className,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <label className={cx("field-group", wrapperClassName, className)}>
      <span className="field-label">{label}</span>
      <select
        {...props}
        className={cx(
          "field-lux select-lux",
          error && "is-invalid",
          fieldClassName
        )}
      >
        {children}
      </select>
      <FieldError error={error} />
    </label>
  );
}

export function TextAreaField({
  label,
  error,
  wrapperClassName,
  fieldClassName,
  className,
  ...props
}: TextAreaFieldProps) {
  return (
    <label className={cx("field-group", wrapperClassName, className)}>
      <span className="field-label">{label}</span>
      <textarea
        {...props}
        className={cx("field-lux", error && "is-invalid", fieldClassName)}
      />
      <FieldError error={error} />
    </label>
  );
}

export function DateField({
  label,
  error,
  wrapperClassName,
  fieldClassName,
  className,
  placeholderText = "Оберіть дату",
  locale = "uk-UA",
  ...props
}: DateFieldProps) {
  const displayValue = formatDateDisplay(props.value, placeholderText, locale);

  return (
    <label className={cx("field-group", wrapperClassName, className)}>
      <span className="field-label">{label}</span>
      <span
        className={cx(
          "field-lux date-shell-lux",
          error && "is-invalid",
          fieldClassName
        )}
      >
        <span
          className={cx(
            "date-display-lux",
            displayValue === placeholderText && "is-placeholder"
          )}
        >
          {displayValue}
        </span>
        <span className="date-display-icon" aria-hidden="true">
          <CalendarFieldIcon className="h-[18px] w-[18px]" />
        </span>
        <input
          {...props}
          type="date"
          className="date-lux-native"
        />
      </span>
      <FieldError error={error} />
    </label>
  );
}

export function PhoneField({
  label,
  error,
  wrapperClassName,
  phoneValue,
  phonePlaceholder,
  phoneMaxLength,
  onPhoneChange,
  inputName = "phone",
  inputClassName
}: PhoneFieldProps) {
  return (
    <label className={cx("field-group", wrapperClassName)}>
      <span className="field-label">{label}</span>
      <input
        name={inputName}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={phoneValue}
        onChange={onPhoneChange}
        placeholder={phonePlaceholder}
        maxLength={phoneMaxLength}
        className={cx(
          "field-lux",
          error && "is-invalid",
          "phone-number-input",
          inputClassName
        )}
      />
      <FieldError error={error} />
    </label>
  );
}

function CalendarFieldIcon({
  className = "h-4 w-4"
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect
        x="4"
        y="5.5"
        width="16"
        height="14.5"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.45"
      />
      <path
        d="M8 3.8v3.1M16 3.8v3.1M4.8 9.6h14.4"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    </svg>
  );
}
