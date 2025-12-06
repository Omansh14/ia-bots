import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Custom styles for react-select
export const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: '40px',
      borderRadius: '0.5rem',
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '0.5rem',
      zIndex: 50,
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: 'lightblue',
      border: 'blue 1px solid',
      borderRadius: '0.25rem',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: 'blue',
      fontSize: '0.875rem',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: 'red',
      '&:hover': {
        backgroundColor: 'hsl(var(--destructive))',
        color: 'hsl(var(--destructive-foreground))',
      },
    }),
  };

  export const customStylesForResizable = {
    container: (provided: any) => ({
      ...provided,
      width: 'auto', // let the container size to content
      minWidth: 120, // smallest width when empty
      maxWidth: '60vw', // optional cap to avoid overflow; tweak as needed
      borderRadius: '0.5rem',
    }),
    control: (provided: any) => ({
      ...provided,
      minWidth: 120, // control shouldn't collapse smaller than this
      boxSizing: 'border-box',
      borderRadius: '0.5rem',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '4px 8px',
      borderRadius: '0.5rem',
    }),
  };
