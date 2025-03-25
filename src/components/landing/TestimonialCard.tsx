
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
}

const TestimonialCard = ({ quote, author, role, avatarUrl }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">
        <Quote className="h-8 w-8 text-primary/20" />
      </div>
      <p className="text-gray-700 italic mb-6">{quote}</p>
      <div className="flex items-center">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={avatarUrl} alt={author} />
          <AvatarFallback>{author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-gray-900">{author}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
