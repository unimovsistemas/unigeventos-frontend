import React, { useRef } from "react";
import InputMask from "react-input-mask";

interface DocumentInputProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DocumentInput: React.FC<DocumentInputProps> = ({ type, value, onChange }) => {
  const cpfMask = "999.999.999-99";
  const rgMask = "99.999.999-9";
  const inputRef = useRef<HTMLInputElement>(null); // Criar a ref corretamente

  return (
    <InputMask
      mask={type === "CPF" ? cpfMask : rgMask}
      value={value}
      onChange={onChange}
    >
      {(inputProps) => (
        <input
          {...inputProps}
          ref={inputRef} // Passando a ref manualmente aqui
          className="border rounded-lg p-2 w-full focus:ring focus:ring-orange-400"
        />
      )}
    </InputMask>
  );
};

export default DocumentInput;
