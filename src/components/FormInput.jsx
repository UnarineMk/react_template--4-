import React from 'react';

function FormInput({ 
  label, 
  id, 
  name, 
  type, 
  placeholder, 
  value, 
  onChange, 
  error,
  required 
}) {
  return (
    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-gray-300 text-sm font-medium mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

export default FormInput;