import React from "react";

interface InputProps {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  register: any;
  error: any;
  disable: any;
}

const Input: React.FunctionComponent<InputProps> = (props) => {
  const { name, label, type, placeholder, register, error, disable, min=0 } = props;

  return (
    <>
      <div className="mb-2">
        {label && (
          <label
            htmlFor={name}
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={name}
          className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          type={type}
          name={name}
          placeholder={placeholder}
          {...register(name)}
        />
        {error && <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600">{error}</p>}
      </div>
    </>
  );
};
export default Input;
