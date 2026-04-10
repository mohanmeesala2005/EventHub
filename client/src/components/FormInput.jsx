import React from "react";

const FormInput = ({
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
  children,
}) => {
  const inputId = id || name;

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
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`.trim()}
          {...inputProps}
        />
        {children}
      </div>
    </div>
  );
};

export default FormInput;
