import React from "react";

interface Props {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  register: any;
  error: any;
  disable: any;
}

const Selects: React.FunctionComponent<Props> = (props) => {
  const { name, label, options, register, error, disable } = props;
  return (
    <>
        <div className="">
        <label
      className="block text-sm font-medium text-gray-700 mb-1"
       htmlFor={name} >{label}</label>
      <select 
      className="w-full p-3 border border-gray-300 "
      name={name}
      {...register(name)}
      disabled={disable}
      id={name}
      >
            {
                options.map((data, index)=>(
                    <option key={index} value={data.value}>
                        {data.value}
                    </option>
                ))
            }
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>} 
      </select>
        </div>
    </>
  );
};
export default Selects;
