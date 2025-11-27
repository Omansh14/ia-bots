import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreateClientFormProps {
  onClose: () => void;
  onSubmit?: (data: ClientFormData) => void;
}

export interface ClientFormData {
  company: string;
  location: string[];
  industry: string;
}

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Education',
  'Telecommunications',
  'Real Estate',
  'Transportation',
  'Energy',
  'Other',
];

export const CreateClientForm = ({ onClose, onSubmit }: CreateClientFormProps) => {
  const [formData, setFormData] = useState<ClientFormData>({
    company: '',
    location: [],
    industry: '',
  });

  const [locationInput, setLocationInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      industry: value,
    }));
  };

  const addLocation = (value?: string) => {
    const v = (value ?? locationInput).trim();
    if (!v) return;

    // Support multiple locations separated by comma or newline
    const parts = v
      .split(/[,\n]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length === 0) {
      setLocationInput('');
      return;
    }

    setFormData((prev) => {
      const next = [...prev.location];
      for (const p of parts) {
        if (!next.includes(p)) next.push(p);
      }
      return { ...prev, location: next };
    });
    setLocationInput('');
  };

  const removeLocation = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      location: prev.location.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If user left a pending location in the input, add it
    if (locationInput.trim()) addLocation(locationInput.trim());

    // Validate form
    if (!formData.company.trim() || formData.location.length === 0 || !formData.industry) {
      alert('Please fill in all fields and add at least one location');
      return;
    }

    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit(formData);
    }

    // Reset form and close dialog
    setFormData({
      company: '',
      location: [],
      industry: '',
    });
    setLocationInput('');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Company Field */}
      <div className="space-y-2">
        <Label htmlFor="company" className="text-sm font-medium">
          Company
        </Label>
        <Input
          id="company"
          name="company"
          placeholder="Enter company name"
          value={formData.company}
          onChange={handleInputChange}
          className="w-full"
        />
      </div>

      {/* Location Field (tag-style textarea) */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium">
          Location
        </Label>
        <div
          className="min-h-[64px] w-full rounded-md flex flex-wrap gap-2 items-center"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex-1 w-full">
            <Textarea
              ref={inputRef}
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  if (locationInput.trim()) addLocation();
                }
              }}
              onBlur={() => locationInput.trim() && addLocation()}
              placeholder={formData.location.length === 0 ? 'Type a location and press Enter' : ''}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Press Enter or comma to add a location.</p>
        {formData.location.map((loc, idx) => (
          <span
            key={`${loc}-${idx}`}
            className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-muted text-sm"
          >
            <span className="max-w-xs truncate">{loc}</span>
            <button
              type="button"
              onClick={() => removeLocation(idx)}
              className="size-3 inline-flex items-center justify-center rounded text-muted-foreground hover:text-destructive"
              aria-label={`Remove ${loc}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Industry Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="industry" className="text-sm font-medium">
          Industry
        </Label>
        <Select value={formData.industry} onValueChange={handleSelectChange}>
          <SelectTrigger id="industry" className="w-full">
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="w-24">
          Back
        </Button>
        <Button type="submit" className="w-24">
          Create
        </Button>
      </div>
    </form>
  );
};
