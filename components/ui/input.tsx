import React from "react";

type InputSize = "sm" | "md" | "lg" | "xl";
type InputVariant = "default" | "error" | "success";

type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>;

type InputProps = Omit<NativeInputProps, "size"> & {
    label?: string;
    size?: InputSize;
    variant?: InputVariant;
    errorMessage?: string;
};

const Input = ({
    label,
    size = "md",
    variant = "default",
    errorMessage,
    className = "",
    ...props
}: InputProps) => {
    const sizes: Record<InputSize, string> = {
        sm: "px-3 py-1.5 text-sm rounded-md",
        md: "px-4 py-2 text-base rounded-lg",
        lg: "px-5 py-3 text-lg rounded-xl",
        xl: "px-6 py-4 text-xl rounded-2xl",
    };

    const variants: Record<InputVariant, string> = {
        default:
            "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
        error:
            "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200",
        success:
            "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200",
    };

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <input
                className={`
          ${sizes[size]}
          ${variants[variant]}
          border
          outline-none
          transition-all
          duration-200
          disabled:bg-gray-100
          disabled:cursor-not-allowed
          ${className}
        `}
                {...props}
            />

            {errorMessage && (
                <span className="text-sm text-red-500">
                    {errorMessage}
                </span>
            )}
        </div>
    );
};

export default Input;
