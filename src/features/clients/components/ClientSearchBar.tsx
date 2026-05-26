// FILE: src/features/clients/components/ClientSearchBar.tsx
// PURPOSE: Controlled search input for filtering clients by name or email substring.
// NOTES: Debounce can be added later; currently immediate updates passed to parent via onChange.

import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { ChangeEvent } from 'react';

export interface ClientSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ClientSearchBar({ value, onChange }: ClientSearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

  return (
    <TextField
      fullWidth
      size="small"
      placeholder="Search clients by name or email"
      value={value}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
  );
}
