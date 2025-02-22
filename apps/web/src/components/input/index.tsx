"use client";
import React, { forwardRef } from "react";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import cn from "@/utils/cn";

interface BaseProps {
  label: string;
  className?: string;
  error?: string;
}

export interface InputProps
  extends BaseProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "password" | "number" | "date" | "email" | "phone";
  showPasswordToggle?: boolean;
  required?: boolean;
}

export interface TextAreaProps
  extends BaseProps,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

interface SelectOptions {
  label: string;
  value: string;
}

export interface SelectProps
  extends BaseProps,
    React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOptions[];
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = "text",
      id,
      error,
      showPasswordToggle = false,
      required = false,
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setShowPassword((prev) => !prev);
    };

    const inputType =
      type === "password" ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative flex w-full flex-col">
        <label
          htmlFor={id}
          className={cn("text-lg text-gray-700", error && "text-error-300")}
        >
          {label}
          {required && <span className="text-sm text-red-400">*</span>}
        </label>
        <input
          id={id}
          type={inputType}
          ref={ref}
          {...rest}
          className={cn(
            "group h-10 rounded-lg border border-gray-400 px-2 outline-none",
            !error && "focus:border-green-400",
            error && "border-error-300",
          )}
        />
        {showPasswordToggle && type === "password" && (
          <button
            className={cn(
              "absolute top-1/2 right-4 cursor-pointer transition-colors",
              "border-none bg-none p-1 outline-none",
              showPassword ? "text-indigo-400" : "text-gray-300",
              "hover:text-indigo-400/70",
              error && "-translate-y-2",
            )}
            type="button"
            onClick={handleTogglePassword}
          >
            {showPassword ? (
              <Eye className="size-5" />
            ) : (
              <EyeClosed className="size-5" />
            )}
          </button>
        )}
        {error && <p className="text-error-300 text-sm">{error}</p>}
      </div>
    );
  },
);

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, id, error, ...rest }, ref) => {
    return (
      <div className="flex flex-col">
        <label htmlFor={id}>{label}</label>
        <textarea
          name=""
          id={id}
          ref={ref}
          {...rest}
          className={cn(
            "group min-h-24 rounded-lg border border-gray-400 px-2 outline-none",
            !error && "focus:border-green-400",
            error && "border-error-300",
          )}
        ></textarea>
      </div>
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, options, className, ...rest }, ref) => {
    return (
      <div className={cn("", className)}>
        <label htmlFor={id}>{label}</label>
        <select id={id} ref={ref} {...rest}>
          <option value="" disabled label="Select an option" />

          {options.map((o) => (
            <option value={o.value} key={o.value} label={o.label} />
          ))}
        </select>
      </div>
    );
  },
);

Input.displayName = "Input";
TextArea.displayName = "TextArea";
Select.displayName = "Select";
