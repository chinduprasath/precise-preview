
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type Platform = {
  value: 'instagram' | 'facebook' | 'twitter' | 'youtube';
  label: string;
  icon: React.ElementType;
};

const platforms: Platform[] = [
  { value: 'instagram', label: 'Instagram', icon: null },
  { value: 'facebook', label: 'Facebook', icon: null },
  { value: 'twitter', label: 'Twitter', icon: null },
  { value: 'youtube', label: 'YouTube', icon: null },
];

const audienceCountries = [
  { value: 'us', label: 'United States' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
  { value: 'id', label: 'Indonesia' },
  { value: 'mx', label: 'Mexico' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ng', label: 'Nigeria' },
  { value: 'ph', label: 'Philippines' },
  { value: 'tr', label: 'Turkey' },
  { value: 'eg', label: 'Egypt' },
] as const;

const audienceLanguages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'hi', label: 'Hindi' },
  { value: 'fr', label: 'French' },
  { value: 'ar', label: 'Arabic' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'de', label: 'German' },
  { value: 'ko', label: 'Korean' },
] as const;

type AudienceCountry = typeof audienceCountries[number]['value'];
type AudienceLanguage = typeof audienceLanguages[number]['value'];

interface ActiveFilterChipsProps {
  searchTerm: string;
  selectedPlatforms: Platform['value'][];
  selectedType: string;
  selectedGender: string;
  selectedAge: string;
  selectedAudienceCountries: AudienceCountry[];
  selectedAudienceLanguages: AudienceLanguage[];
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  selectedNiche: string;
  selectedHashtags: string[];
  countries: any[];
  states: any[];
  cities: any[];
  niches: any[];
  onRemoveFilter: (filterType: string) => void;
}

const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  searchTerm,
  selectedPlatforms,
  selectedType,
  selectedGender,
  selectedAge,
  selectedAudienceCountries,
  selectedAudienceLanguages,
  selectedCountry,
  selectedState,
  selectedCity,
  selectedNiche,
  selectedHashtags,
  countries,
  states,
  cities,
  niches,
  onRemoveFilter
}) => {
  const getActiveFilters = () => {
    const filters = [];
    if (searchTerm) filters.push(`Search: ${searchTerm}`);
    if (selectedPlatforms.length > 0) {
      filters.push(`Platforms: ${selectedPlatforms.map(p => platforms.find(pl => pl.value === p)?.label).join(', ')}`);
    }
    if (selectedType) filters.push(`Type: ${selectedType}`);
    if (selectedGender) filters.push(`Gender: ${selectedGender}`);
    if (selectedAge) filters.push(`Age: ${selectedAge}`);
    if (selectedAudienceCountries.length > 0) {
      filters.push(`Audience Countries: ${selectedAudienceCountries.map(c => audienceCountries.find(ac => ac.value === c)?.label).join(', ')}`);
    }
    if (selectedAudienceLanguages.length > 0) {
      filters.push(`Audience Languages: ${selectedAudienceLanguages.map(l => audienceLanguages.find(al => al.value === l)?.label).join(', ')}`);
    }
    if (selectedCountry) filters.push(`Country: ${countries.find(c => c.id === selectedCountry)?.name}`);
    if (selectedState) filters.push(`State: ${states.find(s => s.id === selectedState)?.name}`);
    if (selectedCity) filters.push(`City: ${cities.find(c => c.id === selectedCity)?.name}`);
    if (selectedNiche) filters.push(`Niche: ${niches.find(n => n.id === selectedNiche)?.name}`);
    if (selectedHashtags.length > 0) filters.push(`Hashtags: ${selectedHashtags.join(', ')}`);
    return filters;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2" id="active-filter-chips">
      {activeFilters.map((filter, index) => (
        <Badge key={index} variant="secondary" className="flex items-center gap-1">
          {filter}
          <X className="h-3 w-3 cursor-pointer" onClick={() => {
            const [key] = filter.split(': ');
            onRemoveFilter(key);
          }} />
        </Badge>
      ))}
    </div>
  );
};

export default ActiveFilterChips;
