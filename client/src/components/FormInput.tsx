import React, { InputHTMLAttributes, ReactNode } from "react";

interface FormInputProps {
  label?: string;
  id?: string;
  name: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
  wrapperClassName?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  error?: string | { message?: string } | any;
  children?: ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  readOnly = false,
  className = "",
  wrapperClassName = "",
  inputProps = {},
  error,
  children,
}) => {
  const inputId = id || name;
  const errorId = `${inputId}-error`;
  const inputClassName = [
    "w-full p-3 border rounded-lg focus:outline-none focus:ring-2",
    error ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={inputClassName}
          {...inputProps}
        />
        {children}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
    </div>
  );
};

export default FormInput;
