import React, { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';

interface ArtistInfoStepProps {
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  initialName?: string;
  initialDescription?: string;
}

export default function ArtistInfoStep({
  onNameChange,
  onDescriptionChange,
  initialName = '',
  initialDescription = ''
}: ArtistInfoStepProps) {
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingName]);

  useEffect(() => {
    if (editingDescription && descInputRef.current) {
      descInputRef.current.focus();
    }
  }, [editingDescription]);

  const handleNameBlur = () => {
    setEditingName(false);
    onNameChange(name);
  };

  const handleDescriptionBlur = () => {
    setEditingDescription(false);
    onDescriptionChange(description);
  };

  const handleDescriptionChange = (text: string) => {
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount <= 10) {
      setDescription(text);
    }
  };

  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="w-full h-[40vh] flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-10">
        {/* Nombre */}
        <div className="text-center">
          {editingName ? (
            <input
              ref={nameInputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              className="text-5xl font-bold text-center w-full bg-transparent outline-none"
            />
          ) : (
            <div
              className="text-5xl font-bold text-vyba-navy cursor-pointer inline-flex items-center gap-2"
              onClick={() => setEditingName(true)}
            >
              {name || "Tu nombre artístico"}
              <Pencil size={20} className="text-vyba-navy ml-2" />
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="text-center">
          {editingDescription ? (
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-full">
                <input
                  ref={descInputRef}
                  type="text"
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  onBlur={handleDescriptionBlur}
                  className="text-lg text-center w-full bg-transparent outline-none"
                  placeholder="Escribe tu descripción (máx. 10 palabras)"
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 pr-2 text-sm text-gray-500 bg-vyba-gray rounded-lg px-2 py-1">{wordCount}/10</span>
              </div>
            </div>
          ) : (
            <div
              className="text-lg text-vyba-tertiary cursor-pointer inline-flex items-center gap-2 max-w-xl mx-auto"
              onClick={() => setEditingDescription(true)}
            >
              <p className="text-vyba-navy font-medium mb-0">
                {description || "Haz clic aquí para escribir tu descripción"}
              </p>
              <Pencil size={20} className="text-vyba-navy ml-2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
