export interface Country {
  id: number;
  name: string;
  code: string | null;
}

export interface State {
  id: number;
  name: string;
  country_id: number;
}

export interface City {
  id: number;
  name: string;
  state_id: number;
}

export interface Niche {
  id: number;
  name: string;
}

export interface Hashtag {
  id: number;
  name: string;
}

export interface Influencer {
  id: string;
  name: string;
  username: string | null;
  bio: string | null;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  niche_id: number | null;
  followers_instagram: number;
  followers_facebook: number;
  followers_twitter: number;
  followers_youtube: number;
  engagement_rate: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  hashtags?: Hashtag[];
  country?: Country;
  state?: State;
  city?: City;
  niche?: Niche;
}

export interface InfluencerWithRelations extends Influencer {
  country?: { id: number; name: string; code: string | null } | null;
  state?: { id: number; name: string; country_id: number } | null;
  city?: { id: number; name: string; state_id: number } | null;
  niche?: { id: number; name: string } | null;
}
