# Pricing Feature Architecture

## Overview

The pricing feature allows influencers to set up and display their service pricing in two models:
1. Platform-based individual pricing
2. Combo package pricing

## Component Structure

```
components/
└── influencers/
    ├── PricesTabContent.tsx       # Main pricing display component
    ├── types/
    │   └── pricing.ts            # Type definitions
    └── utils/
        └── constants.ts          # Pricing constants and configurations
```

## Data Models

### Platform Service
```typescript
interface PlatformService {
  id: string;
  name: string;
  price: string;
}

const platformServices = [
  { id: 'post', name: 'Post Image', price: '499₹' },
  { id: 'reel', name: 'Reel', price: '499₹' },
  { id: 'story', name: 'Story (Image/Video)', price: '499₹' },
  { id: 'shorts', name: 'Shorts', price: '499₹' },
  { id: 'videos', name: 'Videos (>10m)', price: '499₹' },
  { id: 'polls', name: 'Polls', price: '499₹' },
];
```

### Combo Package
```typescript
interface ComboPackage {
  id: string;
  name: string;
  platforms: string;
  price: string;
}

const comboPackages = [
  { 
    id: 'package1', 
    name: 'Packagename-1', 
    platforms: 'Insta/FB/Youtube',
    price: '*****'
  },
  // ... other packages
];
```

## Component Features

### PricesTabContent
- Displays platform-based and combo package pricing options
- Manages selection state for services and packages
- Handles booking initiation
- Provides platform selection dropdown
- Shows pricing information with checkboxes

## State Management

```typescript
// Selection state
const [selectedItems, setSelectedItems] = useState<string[]>([]);

// Platform selection state
const [selectedPlatform, setSelectedPlatform] = useState<string>('platform');
```

## User Interactions

1. **Service Selection**
   - Users can select multiple services
   - Each service has a checkbox
   - Price is displayed next to each service

2. **Package Selection**
   - Users can select combo packages
   - Each package shows included platforms
   - Some prices may be hidden (displayed as *****)

3. **Booking Process**
   - "Book" button initiates booking
   - Validation ensures at least one item is selected
   - Success/error notifications via toast

## Styling

The component uses Tailwind CSS with custom classes:
- Grid layout for two-column display
- Consistent spacing with gap utilities
- Purple accent colors for headers
- Responsive design considerations

## Database Schema

```sql
CREATE TABLE pricing_options (
    id UUID PRIMARY KEY,
    influencer_id UUID REFERENCES influencers(id),
    type VARCHAR(50), -- 'platform' or 'combo'
    name VARCHAR(255),
    price DECIMAL(10,2),
    is_hidden BOOLEAN DEFAULT false,
    platforms TEXT[], -- For combo packages
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Integration

### Endpoints

1. **Get Pricing Options**
```typescript
GET /api/influencers/:id/pricing
Response: {
  platformServices: PlatformService[];
  comboPackages: ComboPackage[];
}
```

2. **Create Booking**
```typescript
POST /api/bookings
Body: {
  influencerId: string;
  selectedItems: string[];
  type: 'platform' | 'combo';
}
```

## Error Handling

1. **Validation Errors**
   - Empty selection
   - Invalid platform selection
   - Missing required fields

2. **API Errors**
   - Network failures
   - Server errors
   - Data validation errors

## Performance Considerations

1. **Optimization**
   - Memoized components
   - Efficient state updates
   - Lazy loading of pricing data

2. **Caching**
   - Cache pricing data
   - Invalidate on updates
   - Local storage for preferences

## Security

1. **Data Protection**
   - Validate all inputs
   - Sanitize price displays
   - Protect hidden prices

2. **Access Control**
   - Verify user permissions
   - Rate limit booking requests
   - Audit pricing changes

## Testing Strategy

1. **Unit Tests**
```typescript
describe('PricesTabContent', () => {
  it('should display all platform services');
  it('should handle service selection');
  it('should validate before booking');
  it('should display hidden prices correctly');
});
```

2. **Integration Tests**
   - Test with real data
   - Verify API integration
   - Check state management

## Future Enhancements

1. **Custom Pricing**
   - Allow custom price input
   - Support negotiation
   - Bulk pricing options

2. **Dynamic Packages**
   - Create custom packages
   - Time-limited offers
   - Seasonal pricing

3. **Analytics**
   - Track popular services
   - Monitor conversion rates
   - Analyze pricing patterns 