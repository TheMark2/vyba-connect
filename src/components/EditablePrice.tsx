import { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";

type EditablePriceProps = {
  value: number;
  currency?: string;
  onChange?: (newValue: number) => void;
};

export default function EditablePrice({
  value,
  currency = "€",
  onChange,
}: EditablePriceProps) {
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleBlur = () => {
    setEditing(false);
    onChange?.(price);
  };

  return (
    <div className="text-7xl font-bold text-vyba-navy text-center">
      {editing ? (
        <input
          ref={inputRef}
          type="text" // <-- Cambiado de 'number' a 'text' para quitar flechas
          inputMode="numeric" // <-- Esto mantiene teclado numérico en móviles
          pattern="[0-9]*"
          value={price}
          onChange={(e) =>
            setPrice(Number(e.target.value.replace(/\D/g, "")))
          }
          onBlur={handleBlur}
          className="text-7xl font-bold text-center outline-none w-full max-w-xs mx-auto bg-transparent"
        />
      ) : (
        <div
          className="cursor-pointer inline-flex items-center gap-2"
          onClick={() => setEditing(true)}
        >
          {currency}
          {price.toLocaleString()}
          <div className="bg-vyba-gray p-3 rounded-full ml-2">
            <Pencil className="text-vyba-navy w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
