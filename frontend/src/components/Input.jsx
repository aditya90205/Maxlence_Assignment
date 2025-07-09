import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    { label, error, helperText, leftIcon, rightIcon, className = "", ...props },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{leftIcon}</div>
            </div>
          )}

          <input
            ref={ref}
            className={`
            block w-full rounded-lg border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500
            ${
              hasError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : ""
            }
            ${leftIcon ? "pl-10" : "pl-3"}
            ${rightIcon ? "pr-10" : "pr-3"}
            py-2
            ${
              props.disabled
                ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                : ""
            }
            ${className}
          `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="text-gray-400">{rightIcon}</div>
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={`mt-1 text-sm ${
              hasError ? "text-red-600" : "text-gray-500"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
