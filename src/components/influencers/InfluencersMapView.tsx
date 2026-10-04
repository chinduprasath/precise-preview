import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Influencer } from '@/types/location';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Search, 
  MapPin, 
  Crosshair, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  X, 
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  PanelRightOpen,
  Radio,
  ChevronRight,
  Sparkles,
  Plus,
  Minus,
  Layers,
  Maximize2,
  Minimize2,
  Scan,
  Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PricesTabContent from '@/components/influencers/PricesTabContent';
import DataTabContent from '@/components/influencers/DataTabContent';
import ServicesTabContent from '@/components/influencers/ServicesTabContent';
import { useToast } from '@/hooks/use-toast';

interface InfluencersMapViewProps {
  influencers: Influencer[];
  selectedInfluencer: Influencer | null;
  onSelectInfluencer: (influencer: Influencer) => void;
  onBookInfluencer: (influencer: Influencer) => void;
}

// Coordinate mapping for Indian cities and major hubs
const CITY_COORDINATES: Record<string, [number, number]> = {
  // Delhi NCR
  'south delhi': [28.5402, 77.2065],
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'north delhi': [28.7041, 77.1025],
  'west delhi': [28.6667, 77.0833],
  'east delhi': [28.6279, 77.2784],
  'noida': [28.5355, 77.3910],
  'gurgaon': [28.4595, 77.0266],
  'gurugram': [28.4595, 77.0266],
  'faridabad': [28.4089, 77.3178],

  // Maharashtra
  'mumbai': [19.0760, 72.8777],
  'pune': [18.5204, 73.8567],
  'nagpur': [21.1458, 79.0882],
  'thane': [19.2183, 72.9781],

  // Karnataka
  'bangalore': [12.9716, 77.5946],
  'bengaluru': [12.9716, 77.5946],
  'mysore': [12.2958, 76.6394],

  // Telangana & AP
  'hyderabad': [17.3850, 78.4867],
  'visakhapatnam': [17.6868, 83.2185],

  // Tamil Nadu
  'chennai': [13.0827, 80.2707],
  'coimbatore': [11.0168, 76.9558],

  // West Bengal
  'kolkata': [22.5726, 88.3639],

  // Gujarat
  'ahmedabad': [23.0225, 72.5714],
  'surat': [21.1702, 72.8311],

  // Rajasthan
  'jaipur': [26.9124, 75.7873],
  'udaipur': [24.5854, 73.7125],

  // Punjab & Haryana
  'chandigarh': [30.7333, 76.7794],
  'amritsar': [31.6340, 74.8723],

  // Goa
  'goa': [15.2993, 74.1240],

  // Kerala
  'kochi': [9.9312, 76.2673],
  
  // Others
  'lucknow': [26.8467, 80.9462],
  'indore': [22.7196, 75.8577],
};

type MapLayerType = 'street' | 'satellite' | 'canvas';

const MAP_LAYERS: Record<MapLayerType, { name: string; label: string; url: string; attribution: string; maxZoom: number }> = {
  street: {
    name: 'Street View',
    label: 'Clean Streets',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, TomTom',
    maxZoom: 19,
  },
  satellite: {
    name: 'Satellite',
    label: 'Aerial View',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; DigitalGlobe, GeoEye, Earthstar',
    maxZoom: 19,
  },
  canvas: {
    name: 'Light Canvas',
    label: 'Minimalist Gray',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; HERE, Garmin, METI/NASA',
    maxZoom: 16,
  },
};

const POPULAR_LOCATIONS = [
  'All',
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Goa',
  'Jaipur',
];

const formatNumber = (num?: number): string => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Deterministic jitter helper so overlapping pins spread out nicely
function getInfluencerCoords(influencer: Influencer, index: number): [number, number] {
  let baseCoords: [number, number] | undefined;
  
  const cityName = influencer.city?.name?.toLowerCase().trim();
  if (cityName && CITY_COORDINATES[cityName]) {
    baseCoords = CITY_COORDINATES[cityName];
  } else if (cityName) {
    const match = Object.keys(CITY_COORDINATES).find(key => cityName.includes(key) || key.includes(cityName));
    if (match) baseCoords = CITY_COORDINATES[match];
  }

  if (!baseCoords) {
    const stateName = influencer.state?.name?.toLowerCase().trim();
    if (stateName && CITY_COORDINATES[stateName]) {
      baseCoords = CITY_COORDINATES[stateName];
    }
  }

  if (!baseCoords) {
    const fallbackCities: [number, number][] = [
      [28.5402, 77.2065], // South Delhi
      [19.0760, 72.8777], // Mumbai
      [12.9716, 77.5946], // Bangalore
      [17.3850, 78.4867], // Hyderabad
      [18.5204, 73.8567], // Pune
      [26.9124, 75.7873], // Jaipur
      [22.5726, 88.3639], // Kolkata
      [13.0827, 80.2707], // Chennai
    ];
    baseCoords = fallbackCities[index % fallbackCities.length];
  }

  const jitterLat = (((index * 17) % 19) - 9) * 0.007;
  const jitterLng = (((index * 23) % 19) - 9) * 0.007;

  return [baseCoords[0] + jitterLat, baseCoords[1] + jitterLng];
}

export default function InfluencersMapView({
  influencers,
  selectedInfluencer,
  onSelectInfluencer,
  onBookInfluencer,
}: InfluencersMapViewProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const audienceCircleRef = useRef<L.Circle | null>(null);

  const [locationSearch, setLocationSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [activeInfluencer, setActiveInfluencer] = useState<Influencer | null>(null);
  
  const [sideProfileInfluencer, setSideProfileInfluencer] = useState<Influencer | null>(null);
  // Currently highlighted audience circle influencer ID
  const [highlightedAudienceId, setHighlightedAudienceId] = useState<string | null>(null);

  // Full Functional Map states & refs
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const hasCenteredInitialViewRef = useRef(false);
  const [currentLayer, setCurrentLayer] = useState<MapLayerType>('street');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync activeInfluencer with parent's selectedInfluencer
  useEffect(() => {
    if (selectedInfluencer) {
      setActiveInfluencer(selectedInfluencer);
    }
  }, [selectedInfluencer]);

  // Filter influencers based on search query or selected tag
  const filteredInfluencers = useMemo(() => {
    return influencers.filter((inf) => {
      const locationText = `${inf.city?.name || ''} ${inf.state?.name || ''} ${inf.country?.name || ''}`.toLowerCase();
      const nameText = `${inf.name || ''} ${inf.username || ''} ${inf.niche?.name || ''}`.toLowerCase();
      
      const query = locationSearch.toLowerCase().trim();

      if (selectedTag !== 'All') {
        const tag = selectedTag.toLowerCase();
        const matchesTag = locationText.includes(tag) || (tag === 'delhi' && locationText.includes('delhi'));
        if (!matchesTag) return false;
      }

      if (!query) return true;
      return locationText.includes(query) || nameText.includes(query);
    });
  }, [influencers, locationSearch, selectedTag]);

  // Close layer menu on outside click
  useEffect(() => {
    if (!isLayerMenuOpen) return;
    const handleOutsideClick = () => setIsLayerMenuOpen(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isLayerMenuOpen]);

  // Request user's location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserCoords(coords);
          setIsLocating(false);
        },
        (err) => {
          console.warn('Geolocation access not available or denied:', err.message);
          setUserCoords([28.5402, 77.2065]);
          setIsLocating(false);
        },
        { timeout: 7000 }
      );
    } else {
      setUserCoords([28.5402, 77.2065]);
    }
  }, []);

  // Initialize Leaflet Map with full functional zoom and interaction
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const defaultCenter: [number, number] = [28.5402, 77.2065];
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 11,
      minZoom: 3,
      maxZoom: 19,
      zoomControl: false, // Replaced with custom sleek floating controls
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
    });

    // Add initial tile layer
    const initialConfig = MAP_LAYERS.street;
    tileLayerRef.current = L.tileLayer(initialConfig.url, {
      attribution: initialConfig.attribution,
      maxZoom: initialConfig.maxZoom,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Invalidate size once DOM stabilizes
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Dynamic Tile Layer Switcher (Street, Satellite, Light Canvas)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const config = MAP_LAYERS[currentLayer];
    tileLayerRef.current = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
    }).addTo(map);
  }, [currentLayer]);

  // Automatic Viewport Resizing (Fixes Leaflet canvas misalignment when drawers open/close)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [sideProfileInfluencer, isFullscreen]);

  // Update User Location Marker on the Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userCoords);
    } else {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></span>
            <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center">
              <div class="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(userCoords, { icon: userIcon, zIndexOffset: 1000 });
      marker.bindTooltip('Your Location', { direction: 'top', offset: [0, -10] });
      marker.addTo(map);
      userMarkerRef.current = marker;

      // Only set initial view once on startup so user's manual zoom out / pan isn't overwritten
      if (!hasCenteredInitialViewRef.current && !selectedInfluencer) {
        map.setView(userCoords, 11);
        hasCenteredInitialViewRef.current = true;
      }
    }
  }, [userCoords, selectedInfluencer]);

  // Open profile page in new tab
  const handleOpenProfileInNewTab = (influencerId: string) => {
    window.open(`/influencers/${influencerId}`, '_blank', 'noopener,noreferrer');
  };

  // Render Influencer Markers with Custom Hover Tooltips
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    filteredInfluencers.forEach((inf, idx) => {
      const coords = getInfluencerCoords(inf, idx);
      const isSelected = activeInfluencer?.id === inf.id || sideProfileInfluencer?.id === inf.id;
      const avatarUrl = inf.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200';
      const handleName = inf.username || `@${inf.name.toLowerCase().replace(/\s+/g, '_')}`;
      const locationText = inf.city?.name 
        ? `${inf.city.name}${inf.state?.name ? `, ${inf.state.name}` : ''}`
        : (inf.state?.name || 'India');

      const customIcon = L.divIcon({
        className: `influencer-pin-marker ${isSelected ? 'pin-active' : ''}`,
        html: `
          <div class="group relative cursor-pointer transition-transform duration-200 hover:scale-110">
            <!-- Pin Body -->
            <div class="w-11 h-11 rounded-full p-0.5 shadow-lg border-2 ${
              isSelected ? 'border-primary ring-4 ring-primary/30' : 'border-white bg-card'
            } overflow-hidden bg-background">
              <img src="${avatarUrl}" alt="${inf.name}" class="w-full h-full rounded-full object-cover" />
            </div>
            
            <!-- Pin Pointer Tail -->
            <div class="w-2.5 h-2.5 transform rotate-45 mx-auto -mt-1 shadow-xs ${
              isSelected ? 'bg-primary' : 'bg-gray-800'
            }"></div>

            ${inf.is_verified ? `
              <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                ✓
              </div>
            ` : ''}
          </div>
        `,
        iconSize: [44, 52],
        iconAnchor: [22, 50],
      });

      // Rich hover popup HTML containing Influencer Name and Social Media Followers & Counts
      const tooltipContent = `
        <div class="bg-card text-card-foreground p-3.5 rounded-xl shadow-2xl border border-border w-68 text-left pointer-events-auto">
          <div class="flex items-center gap-3 mb-2.5 pb-2 border-b border-border/70">
            <div class="relative w-11 h-11 shrink-0 rounded-full overflow-hidden border border-border">
              <img src="${avatarUrl}" class="w-full h-full object-cover" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="font-bold text-sm text-foreground truncate leading-tight">${inf.name}</h4>
              <p class="text-xs text-primary font-medium truncate">${handleName}</p>
              <p class="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                <span>📍</span> ${locationText}
              </p>
            </div>
          </div>

          <!-- Social Media Icons & Follower Counts -->
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="flex items-center gap-1.5 p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 font-semibold">
              <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>${formatNumber(inf.followers_instagram)}</span>
            </div>

            <div class="flex items-center gap-1.5 p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold">
              <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
              <span>${formatNumber(inf.followers_facebook)}</span>
            </div>

            <div class="flex items-center gap-1.5 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-semibold">
              <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              <span>${formatNumber(inf.followers_youtube)}</span>
            </div>

            <div class="flex items-center gap-1.5 p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 font-semibold">
              <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
              <span>${formatNumber(inf.followers_twitter)}</span>
            </div>
          </div>
          
          <div class="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs">
            <span class="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Available
            </span>
            <a 
              href="/influencers/${inf.id}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View Profile ↗
            </a>
          </div>
        </div>
      `;

      const marker = L.marker(coords, { icon: customIcon });

      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        className: 'influencer-map-tooltip',
        offset: [0, -42],
        opacity: 1,
        interactive: true,
      });

      marker.on('click', () => {
        setActiveInfluencer(inf);
        onSelectInfluencer(inf);
        map.panTo(coords, { animate: true, duration: 0.6 });
      });

      marker.addTo(map);
      markersRef.current[inf.id] = marker;
    });
  }, [filteredInfluencers, activeInfluencer, onSelectInfluencer]);

  // Highlight Audience Location Circle Area on the Map (Item 5)
  const highlightAudienceArea = (inf: Influencer) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Get influencer coordinates
    const infIndex = influencers.findIndex(i => i.id === inf.id);
    const coords = getInfluencerCoords(inf, infIndex >= 0 ? infIndex : 0);

    // Remove any existing audience circle
    if (audienceCircleRef.current) {
      audienceCircleRef.current.remove();
      audienceCircleRef.current = null;
    }

    const locationName = inf.city?.name || inf.state?.name || 'Primary Region';

    // Draw radius circle highlighting the influencer's core audience zone (~16km radius)
    const circle = L.circle(coords, {
      radius: 16000,
      color: '#2563eb',
      weight: 2.5,
      dashArray: '6, 8',
      fillColor: '#3b82f6',
      fillOpacity: 0.22,
    }).addTo(map);

    circle.bindTooltip(
      `<div class="text-xs font-semibold px-2.5 py-1 bg-blue-600 text-white rounded-md shadow-lg border border-blue-400">
         📍 ${inf.name}'s Audience Area (~16 km radius • ${locationName})
       </div>`,
      { permanent: true, direction: 'top', className: 'audience-circle-tooltip', offset: [0, -10] }
    );

    audienceCircleRef.current = circle;
    setHighlightedAudienceId(inf.id);

    // Smoothly fit bounds to circle so the user sees the complete circle without being over-zoomed
    map.fitBounds(circle.getBounds(), { padding: [50, 50], maxZoom: 13 });
  };

  const removeAudienceHighlight = () => {
    if (audienceCircleRef.current) {
      audienceCircleRef.current.remove();
      audienceCircleRef.current = null;
    }
    setHighlightedAudienceId(null);
  };

  // Toggle or highlight audience location circle on map (Item 2)
  const handleToggleAudienceCircle = (inf: Influencer, e: React.MouseEvent) => {
    e.stopPropagation();
    if (highlightedAudienceId === inf.id && audienceCircleRef.current) {
      removeAudienceHighlight();
      toast({
        title: "Audience Circle Cleared",
        description: `Closed audience area circle for ${inf.name}.`,
      });
    } else {
      highlightAudienceArea(inf);
      setActiveInfluencer(inf);
      onSelectInfluencer(inf);
      toast({
        title: "Audience Location Highlighted",
        description: `Highlighting ${inf.name}'s core audience zone on the map.`,
      });
    }
  };

  // When card right-end profile drawer icon is clicked: open side profile section (Item 3)
  const handleOpenSideProfileSection = (inf: Influencer) => {
    setSideProfileInfluencer(inf);
    setActiveInfluencer(inf);
    onSelectInfluencer(inf);
  };

  const handleCloseSideProfileSection = () => {
    setSideProfileInfluencer(null);
  };

  // Handle Location Search / Tag Selection
  const handleLocationSearch = (query: string) => {
    setLocationSearch(query);
    const map = mapInstanceRef.current;
    if (!map) return;

    const trimmed = query.toLowerCase().trim();
    if (!trimmed) {
      if (userCoords) map.setView(userCoords, 11);
      return;
    }

    let targetCoords = CITY_COORDINATES[trimmed];
    if (!targetCoords) {
      const match = Object.keys(CITY_COORDINATES).find(key => key.includes(trimmed) || trimmed.includes(key));
      if (match) targetCoords = CITY_COORDINATES[match];
    }

    if (targetCoords) {
      map.flyTo(targetCoords, 12, { duration: 1.2 });
    }
  };

  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag);
    if (tag === 'All') {
      setLocationSearch('');
      if (mapInstanceRef.current && userCoords) {
        mapInstanceRef.current.setView(userCoords, 11);
      }
      return;
    }

    handleLocationSearch(tag);
  };

  const handleRecenterUserLocation = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userCoords) {
      map.flyTo(userCoords, 12, { duration: 1 });
    } else if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserCoords(coords);
          setIsLocating(false);
          map.flyTo(coords, 12, { duration: 1 });
        },
        () => setIsLocating(false)
      );
    }
  };

  const handleCardClick = (inf: Influencer) => {
    setActiveInfluencer(inf);
    onSelectInfluencer(inf);
    const marker = markersRef.current[inf.id];
    if (marker && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(marker.getLatLng(), { animate: true, duration: 0.6 });
      marker.openTooltip();
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleFitAllMarkers = () => {
    const map = mapInstanceRef.current;
    if (!map || filteredInfluencers.length === 0) return;
    const coordsList = filteredInfluencers.map((inf, idx) => getInfluencerCoords(inf, idx));
    const bounds = L.latLngBounds(coordsList);
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    toast({
      title: "View Adjusted",
      description: `Showing all ${filteredInfluencers.length} visible creators on the map.`,
    });
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);
  };

  const getSocialMediaPageName = (influencer: Influencer) => {
    if (influencer.followers_instagram && influencer.followers_instagram > 0) {
      return `@${influencer.name.toLowerCase().replace(/\s+/g, '_')}`;
    }
    if (influencer.followers_facebook && influencer.followers_facebook > 0) {
      return `${influencer.name.replace(/\s+/g, '_')} on Facebook`;
    }
    if (influencer.followers_youtube && influencer.followers_youtube > 0) {
      return `${influencer.name.replace(/\s+/g, '_')} YouTube`;
    }
    return `@${influencer.name.toLowerCase().replace(/\s+/g, '_')}`;
  };

  return (
    <div className={`relative w-full ${
      isFullscreen 
        ? 'fixed inset-0 z-[9990] h-screen w-screen rounded-none bg-background' 
        : 'h-[calc(100vh-170px)] min-h-[620px] rounded-2xl border border-border shadow-sm bg-background'
    } overflow-hidden flex flex-col md:flex-row transition-all duration-300`}>
      {/* SECTION 1 (LEFT SIDE): Location Search & Influencers List */}
      <div className="w-full md:w-[360px] lg:w-[390px] h-[340px] md:h-full shrink-0 border-r border-border bg-card flex flex-col z-10 shadow-lg md:shadow-none">
        {/* Header & Search Bar */}
        <div className="p-4 border-b border-border space-y-3 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Explore by Location</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecenterUserLocation}
              disabled={isLocating}
              className="h-7 text-xs px-2.5 gap-1.5 text-muted-foreground hover:text-foreground"
              title="Center on my location"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-primary' : ''}`} />
              <span>Near Me</span>
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={locationSearch}
              onChange={(e) => handleLocationSearch(e.target.value)}
              placeholder="Search city, region, or influencer..."
              className="pl-9 pr-8 h-9 text-xs bg-muted/20 border-border/70 focus-visible:bg-background"
            />
            {locationSearch && (
              <button
                type="button"
                onClick={() => handleLocationSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Location Filter Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {POPULAR_LOCATIONS.map((loc) => {
              const active = selectedTag === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleSelectTag(loc)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap text-xs transition-colors shrink-0 ${
                    active
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>

          {/* Count bar */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
            <span>
              Showing <strong className="text-foreground">{filteredInfluencers.length}</strong> influencer{filteredInfluencers.length === 1 ? '' : 's'} on map
            </span>
            {selectedTag !== 'All' && (
              <span className="text-primary font-medium">📍 {selectedTag}</span>
            )}
          </div>
        </div>

        {/* Scrollable Influencers List with Right-End Profile / Audience Icon */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {filteredInfluencers.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-medium text-foreground">No influencers found</p>
              <p className="text-xs text-muted-foreground">
                Try searching another city or click "All" to view all available creators.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSelectTag('All')}
                className="mt-2 text-xs"
              >
                Reset to All
              </Button>
            </div>
          ) : (
            filteredInfluencers.map((inf) => {
              const isSelected = activeInfluencer?.id === inf.id;
              const isDrawerActive = sideProfileInfluencer?.id === inf.id;
              const isAudienceActive = highlightedAudienceId === inf.id;
              const avatarUrl = inf.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200';
              const locationStr = inf.city?.name
                ? `${inf.city.name}${inf.state?.name ? `, ${inf.state.name}` : ''}`
                : (inf.state?.name || 'India');

              return (
                <div
                  key={inf.id}
                  onClick={() => handleCardClick(inf)}
                  className={`p-3.5 transition-all cursor-pointer hover:bg-muted/40 ${
                    isDrawerActive 
                      ? 'bg-primary/10 border-l-4 border-l-primary' 
                      : isSelected 
                        ? 'bg-primary/5 border-l-4 border-l-primary' 
                        : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-11 w-11 shrink-0 border border-border shadow-xs">
                      <img src={avatarUrl} alt={inf.name} className="object-cover w-full h-full" />
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-semibold text-sm text-foreground truncate">{inf.name}</h4>
                        
                        {/* Right side actions: Book + Audience Circle Icon + Profile Drawer Icon */}
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onBookInfluencer(inf);
                            }}
                            className="h-6 px-2 text-[11px] font-medium text-primary hover:bg-primary/10 hover:text-primary shrink-0"
                          >
                            Book
                          </Button>

                          {/* Icon 1: Highlight Audience Location Circle Area on the Map */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleAudienceCircle(inf, e)}
                            className={`p-1.5 rounded-md transition-all ${
                              isAudienceActive
                                ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400/50'
                                : 'text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                            }`}
                            title={isAudienceActive ? "Hide Audience Location Circle" : "Highlight Audience Location Area on Map"}
                          >
                            <Radio className={`w-3.5 h-3.5 ${isAudienceActive ? 'animate-pulse' : ''}`} />
                          </button>

                          {/* Icon 2: Open Profile Details Section beside the list */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isDrawerActive) {
                                handleCloseSideProfileSection();
                              } else {
                                handleOpenSideProfileSection(inf);
                              }
                            }}
                            className={`p-1.5 rounded-md transition-colors ${
                              isDrawerActive
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                            }`}
                            title={isDrawerActive ? "Close Profile Details Section" : "Open Profile Details Section Beside List"}
                          >
                            <PanelRightOpen className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 truncate">
                        {inf.niche && (
                          <span className="font-medium text-foreground/80">{inf.niche.name}</span>
                        )}
                        {inf.niche && <span>•</span>}
                        <span className="truncate">📍 {locationStr}</span>
                      </div>

                      {/* Social followers row */}
                      <div className="flex items-center gap-2.5 mt-2 flex-wrap text-xs">
                        {inf.followers_instagram ? (
                          <div className="flex items-center gap-1 text-pink-600 dark:text-pink-400">
                            <Instagram className="w-3.5 h-3.5" />
                            <span className="font-medium text-[11px]">{formatNumber(inf.followers_instagram)}</span>
                          </div>
                        ) : null}
                        {inf.followers_facebook ? (
                          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <Facebook className="w-3.5 h-3.5" />
                            <span className="font-medium text-[11px]">{formatNumber(inf.followers_facebook)}</span>
                          </div>
                        ) : null}
                        {inf.followers_youtube ? (
                          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                            <Youtube className="w-3.5 h-3.5" />
                            <span className="font-medium text-[11px]">{formatNumber(inf.followers_youtube)}</span>
                          </div>
                        ) : null}
                        {inf.followers_twitter ? (
                          <div className="flex items-center gap-1 text-sky-500">
                            <Twitter className="w-3.5 h-3.5" />
                            <span className="font-medium text-[11px]">{formatNumber(inf.followers_twitter)}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SECTION 2 (BESIDE LEFT LIST): Profile Details Section (Items 3 & 5, matches Image 2) */}
      {sideProfileInfluencer && (
        <div className="w-full sm:w-[480px] lg:w-[520px] h-full shrink-0 border-r border-border bg-card z-20 flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-200">
          {/* Top action bar of profile section */}
          <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card/95 backdrop-blur-md z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <h3 className="font-bold text-base text-foreground">Profile Overview</h3>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Item 2: Open profile in new tab */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenProfileInNewTab(sideProfileInfluencer.id)}
                className="h-8 text-xs gap-1.5 px-2.5 text-primary hover:text-primary hover:bg-primary/10"
                title="Open full profile in new tab"
              >
                <span>View Full Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseSideProfileSection}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Close Profile Section"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Profile Details Content matching Image 2 */}
          <div className="p-5 space-y-6">
            {/* Audience Location Highlight Banner (Item 5) */}
            <div 
              onClick={() => highlightAudienceArea(sideProfileInfluencer)}
              className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 text-xs cursor-pointer transition-colors"
              title="Click to view & center audience reach area on map"
            >
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-medium">
                <Radio className={`w-4 h-4 text-blue-600 ${highlightedAudienceId === sideProfileInfluencer.id ? 'animate-pulse' : ''}`} />
                <span>Audience Reach Area Highlighted on Map</span>
              </div>
              <span className="font-semibold text-blue-800 dark:text-blue-300">~16 km Radius</span>
            </div>

            {/* Profile Header Block matching Image 2 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">Profile</h2>
                <Button 
                  onClick={() => onBookInfluencer(sideProfileInfluencer)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2"
                >
                  Book
                </Button>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-2 border-border shadow-xs">
                    <img 
                      src={sideProfileInfluencer.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'} 
                      alt={sideProfileInfluencer.name} 
                      className="h-full w-full object-cover" 
                    />
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {getSocialMediaPageName(sideProfileInfluencer)}
                      </h3>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate('/chats')} 
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      {sideProfileInfluencer.niche && (
                        <span>{sideProfileInfluencer.niche.name}</span>
                      )}
                      {sideProfileInfluencer.city && (
                        <span>• {sideProfileInfluencer.city.name}, {sideProfileInfluencer.state?.name || 'India'}</span>
                      )}
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Social media follower counts column matching Image 2 */}
                <div className="flex flex-row gap-x-5 shrink-0">
                  {sideProfileInfluencer.followers_instagram ? (
                    <div className="flex flex-col items-center gap-1">
                      <Instagram className="h-5 w-5 text-social-instagram" />
                      <span className="text-xs font-semibold">{formatNumber(sideProfileInfluencer.followers_instagram)}</span>
                    </div>
                  ) : null}
                  {sideProfileInfluencer.followers_facebook ? (
                    <div className="flex flex-col items-center gap-1">
                      <Facebook className="h-5 w-5 text-social-facebook" />
                      <span className="text-xs font-semibold">{formatNumber(sideProfileInfluencer.followers_facebook)}</span>
                    </div>
                  ) : null}
                  {sideProfileInfluencer.followers_youtube ? (
                    <div className="flex flex-col items-center gap-1">
                      <Youtube className="h-5 w-5 text-social-youtube" />
                      <span className="text-xs font-semibold">{formatNumber(sideProfileInfluencer.followers_youtube)}</span>
                    </div>
                  ) : null}
                  {sideProfileInfluencer.followers_twitter ? (
                    <div className="flex flex-col items-center gap-1">
                      <Twitter className="h-5 w-5 text-social-twitter" />
                      <span className="text-xs font-semibold">{formatNumber(sideProfileInfluencer.followers_twitter)}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Profile Tabs matching Image 2 */}
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="prices">Prices</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="services" className="mt-4">
                <ServicesTabContent 
                  influencerId={sideProfileInfluencer.id} 
                  influencerName={sideProfileInfluencer.name} 
                />
              </TabsContent>

              <TabsContent value="prices" className="mt-4">
                <PricesTabContent 
                  influencerId={sideProfileInfluencer.id} 
                  influencerName={sideProfileInfluencer.name} 
                />
              </TabsContent>

              <TabsContent value="data" className="mt-4">
                <DataTabContent influencerId={sideProfileInfluencer.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* SECTION 3: Interactive Full Map */}
      <div className="flex-1 relative h-[400px] md:h-full bg-muted/20 min-w-0">
        <div ref={mapContainerRef} className="w-full h-full outline-none" />

        {/* Top-Left: Floating Status Badges */}
        <div className="absolute top-4 left-4 z-[500] pointer-events-none flex flex-col gap-2">
          <div className="bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border/80 shadow-md text-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="font-medium text-foreground text-[11px]">Hover icons to preview profile</span>
          </div>

          {audienceCircleRef.current && (
            <div className="bg-blue-600/90 text-white backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md text-xs flex items-center gap-1.5 font-medium animate-in fade-in">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Audience Reach Area Active</span>
            </div>
          )}
        </div>

        {/* Top-Right: Full Functional Floating Map Controls Bar */}
        <div className="absolute top-4 right-4 z-[500] flex flex-col items-end gap-2 pointer-events-auto">
          {/* Basemap Switcher Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLayerMenuOpen((prev) => !prev);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-lg text-xs font-medium text-foreground hover:bg-muted/80 transition-all cursor-pointer"
              title="Change map style"
            >
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span className="capitalize">{MAP_LAYERS[currentLayer].name}</span>
            </button>

            {isLayerMenuOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-9 w-44 bg-card/98 backdrop-blur-lg border border-border rounded-xl shadow-2xl p-1.5 space-y-1 z-30 animate-in fade-in zoom-in-95"
              >
                {(Object.keys(MAP_LAYERS) as MapLayerType[]).map((key) => {
                  const layer = MAP_LAYERS[key];
                  const isActive = currentLayer === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setCurrentLayer(key);
                        setIsLayerMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'text-foreground hover:bg-muted/80'
                      }`}
                    >
                      <span>{layer.name}</span>
                      <span className={`text-[10px] opacity-75 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}>{layer.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Main Controls Dock: Zoom In, Zoom Out, Fit Bounds, Recenter, Fullscreen */}
          <div className="flex flex-col bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-xl overflow-hidden divide-y divide-border/60">
            {/* Zoom In (+), fully functional */}
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors flex items-center justify-center cursor-pointer"
              title="Zoom In (+)"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Zoom Out (-), fully functional */}
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors flex items-center justify-center cursor-pointer"
              title="Zoom Out (-)"
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Fit All Markers in View */}
            <button
              type="button"
              onClick={handleFitAllMarkers}
              className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex items-center justify-center cursor-pointer"
              title="Fit All Creators in View"
            >
              <Scan className="w-4 h-4" />
            </button>

            {/* Recenter My Location */}
            <button
              type="button"
              onClick={handleRecenterUserLocation}
              disabled={isLocating}
              className="p-2.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors flex items-center justify-center disabled:opacity-50 cursor-pointer"
              title="Center on My Location"
            >
              <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {/* Toggle Fullscreen Map */}
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors flex items-center justify-center cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Active Influencer Floating Quick Bar (Mobile / Compact View) */}
        {activeInfluencer && !sideProfileInfluencer && (
          <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:w-96 z-[500] bg-card/95 backdrop-blur-md p-3.5 rounded-xl border border-border shadow-xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary shrink-0">
                <img src={activeInfluencer.image_url} alt={activeInfluencer.name} className="object-cover w-full h-full" />
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground truncate">{activeInfluencer.name}</h4>
                  <button
                    onClick={() => setActiveInfluencer(null)}
                    className="text-muted-foreground hover:text-foreground p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {activeInfluencer.niche?.name || 'Creator'} • 📍 {activeInfluencer.city?.name || 'India'}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-[11px] font-semibold text-pink-600">IG: {formatNumber(activeInfluencer.followers_instagram)}</span>
                  <span>•</span>
                  <span className="text-[11px] font-semibold text-blue-600">FB: {formatNumber(activeInfluencer.followers_facebook)}</span>
                  <span>•</span>
                  <span className="text-[11px] font-semibold text-red-600">YT: {formatNumber(activeInfluencer.followers_youtube)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-border">
              {/* Item 2: Open profile in new tab */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenProfileInNewTab(activeInfluencer.id)}
                className="flex-1 text-xs h-8 gap-1"
              >
                <span>View Profile</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </Button>
              <Button
                size="sm"
                onClick={() => handleOpenSideProfileSection(activeInfluencer)}
                className="flex-1 text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Profile & Map Zone
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Global CSS for Leaflet Tooltips & Pins */}
      <style>{`
        .influencer-map-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .influencer-map-tooltip::before {
          display: none !important;
        }
        .audience-circle-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .audience-circle-tooltip::before {
          display: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          line-height: normal !important;
        }
      `}</style>
    </div>
  );
}
