import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Input } from './Input';
import { BENGALURU_LOCATIONS } from '../data/locations';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Enter area (e.g. Indiranagar)",
  label = "Location (Area)",
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onChange(query);

    if (query.length > 1) {
      const filtered = BENGALURU_LOCATIONS.filter(loc => 
        loc.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10); // Show top 10 matches
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelect = (loc: string) => {
    onChange(loc.trim());
    setIsOpen(false);
  };

  const formatLocation = (loc: string) => {
    return loc.trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Input
        label={label}
        icon={MapPin}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
            if (value.length > 1) setIsOpen(true);
        }}
        required={required}
        autoComplete="off"
      />

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
             <Search className="h-3 w-3" />
             Suggestions
          </div>
          {suggestions.map((loc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(loc)}
              className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors flex flex-col"
            >
              <span className="font-semibold">{formatLocation(loc)}</span>
              <span className="text-[10px] text-slate-400">Bengaluru Area</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
