import React from 'react';
import { Instagram, Facebook, Youtube, Twitter, Trash2, Edit2, Save, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';

export type Platform = 'instagram' | 'youtube' | 'facebook' | 'twitter';

export interface MarketingOffer {
  id: string;
  url: string;
  type: 'Story' | 'Collab' | 'Reshare';
  message: string;
  duration: number;
  durationUnit: 'hours' | 'days';
  status: 'Active' | 'Inactive' | 'Completed';
  platforms: Platform[];
  createdAt: Date;
  isEditing?: boolean;
}

interface OfferCardProps {
  offer: MarketingOffer;
  onUpdate: (id: string, updates: Partial<MarketingOffer>) => void;
  onDelete: (id: string) => void;
  onToggleEdit: (id: string) => void;
  onSave: (id: string) => void;
}

const platformIcons: Record<Platform, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
};

const platformColors: Record<Platform, string> = {
  instagram: 'bg-gradient-to-br from-pink-500 to-purple-600',
  youtube: 'bg-red-600',
  facebook: 'bg-blue-600',
  twitter: 'bg-sky-500',
};

const allPlatforms: Platform[] = ['instagram', 'youtube', 'facebook', 'twitter'];

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onUpdate,
  onDelete,
  onToggleEdit,
  onSave,
}) => {
  const isEditing = offer.isEditing;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const togglePlatform = (platform: Platform) => {
    if (!isEditing) return;
    const currentPlatforms = offer.platforms || [];
    const newPlatforms = currentPlatforms.includes(platform)
      ? currentPlatforms.filter(p => p !== platform)
      : [...currentPlatforms, platform];
    onUpdate(offer.id, { platforms: newPlatforms });
  };

  return (
    <Card className="p-4 bg-card border border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Platform icons */}
          <div className="flex gap-1">
            {(offer.platforms || []).map(platform => (
              <div key={platform} className={`p-1.5 ${platformColors[platform]} rounded-lg text-white`}>
                {platformIcons[platform]}
              </div>
            ))}
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(offer.status)}`}>
            {offer.status}
          </span>
          <Badge variant="outline" className="text-xs">
            {offer.type}
          </Badge>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => onSave(offer.id)}
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleEdit(offer.id)}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(offer.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Date and Time Posted */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Calendar className="h-3.5 w-3.5" />
        <span>Posted: {format(offer.createdAt, 'MMM dd, yyyy')} at {format(offer.createdAt, 'hh:mm a')}</span>
      </div>

      <div className="space-y-4">
        {/* Platforms Multi-select */}
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Platforms</label>
          <div className="flex gap-2 flex-wrap">
            {allPlatforms.map(platform => {
              const isSelected = (offer.platforms || []).includes(platform);
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  disabled={!isEditing}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    isSelected
                      ? `${platformColors[platform]} text-white border-transparent`
                      : 'bg-muted text-muted-foreground border-border hover:bg-accent'
                  } ${!isEditing ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                  {platformIcons[platform]}
                  <span className="capitalize">{platform}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* URL Input + Type Dropdown */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Post URL</label>
            <Input
              placeholder="https://..."
              value={offer.url}
              onChange={(e) => onUpdate(offer.id, { url: e.target.value })}
              disabled={!isEditing}
              className="bg-background"
            />
          </div>
          <div className="w-32">
            <label className="text-xs text-muted-foreground mb-1 block">Type</label>
            <Select
              value={offer.type}
              onValueChange={(value: 'Story' | 'Collab' | 'Reshare') => onUpdate(offer.id, { type: value })}
              disabled={!isEditing}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Story">Story</SelectItem>
                <SelectItem value="Collab">Collab</SelectItem>
                <SelectItem value="Reshare">Reshare</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Message Textarea */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Message / Instructions</label>
          <Textarea
            placeholder="Enter instructions for the offer..."
            value={offer.message}
            onChange={(e) => onUpdate(offer.id, { message: e.target.value })}
            disabled={!isEditing}
            rows={3}
            className="bg-background resize-none"
          />
        </div>

        {/* Duration + Status */}
        <div className="flex gap-4">
          <div className="flex gap-2 flex-1">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Duration</label>
              <Input
                type="number"
                min={1}
                value={offer.duration}
                onChange={(e) => onUpdate(offer.id, { duration: parseInt(e.target.value) || 1 })}
                disabled={!isEditing}
                className="bg-background"
              />
            </div>
            <div className="w-24">
              <label className="text-xs text-muted-foreground mb-1 block">Unit</label>
              <Select
                value={offer.durationUnit}
                onValueChange={(value: 'hours' | 'days') => onUpdate(offer.id, { durationUnit: value })}
                disabled={!isEditing}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-32">
            <label className="text-xs text-muted-foreground mb-1 block">Status</label>
            <Select
              value={offer.status}
              onValueChange={(value: 'Active' | 'Inactive' | 'Completed') => onUpdate(offer.id, { status: value })}
              disabled={!isEditing}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OfferCard;