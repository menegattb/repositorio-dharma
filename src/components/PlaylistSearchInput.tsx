import React from 'react';

interface PlaylistSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PlaylistSearchInput: React.FC<PlaylistSearchInputProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      className="ml-4 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm w-56"
      placeholder="Buscar playlist..."
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label="Buscar playlist"
    />
  );
};

export default PlaylistSearchInput;
