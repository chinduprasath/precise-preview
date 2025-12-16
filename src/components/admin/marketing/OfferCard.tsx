import React from 'react';
import { format } from 'date-fns';
import { Instagram, Facebook, Youtube, Twitter, Edit2, Trash2, ExternalLink, Clock, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

const platformIcons: Record<Platform, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
};

interface OfferCardProps {
  offer: MarketingOffer;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Inactive': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'Completed': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Story': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'Collab': return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
      case 'Reshare': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="border border-border bg-card">
      <CardContent className="p-4 space-y-3">
        {/* Header with Status and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(offer.status)}>
              {offer.status}
            </Badge>
            <Badge variant="outline" className={getTypeColor(offer.type)}>
              {offer.type}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(offer.id)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(offer.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>

        {/* URL Row */}
        <div className="flex items-center gap-2">
          <a
            href={offer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline truncate flex-1"
          >
            {offer.url || 'No URL provided'}
          </a>
          {offer.url && (
            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>

        {/* Platforms */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Platforms:</span>
          <div className="flex items-center gap-1">
            {offer.platforms.map(platform => (
              <span key={platform} className="text-primary">
                {platformIcons[platform]}
              </span>
            ))}
          </div>
        </div>

        {/* Message */}
        {offer.message && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {offer.message}
          </p>
        )}

        {/* Footer with Duration and Date */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{offer.duration} {offer.durationUnit}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(offer.createdAt), 'MMM dd, yyyy HH:mm')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferCard;