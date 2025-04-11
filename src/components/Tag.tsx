
import React from 'react';
import { TagType } from '@/types/post';
import { cn } from '@/lib/utils';

interface TagProps {
  tag: TagType;
  className?: string;
}

const tagColors: Record<TagType, string> = {
  'Chill': 'bg-blue-100 text-blue-800',
  'Party': 'bg-purple-100 text-purple-800',
  'Food': 'bg-green-100 text-green-800',
  'Hookup vibes': 'bg-pink-100 text-pink-800',
  'Study session': 'bg-yellow-100 text-yellow-800'
};

const Tag = ({ tag, className }: TagProps) => {
  return (
    <span 
      className={cn(
        'inline-block rounded-full px-3 py-1 text-xs font-semibold mr-2',
        tagColors[tag],
        className
      )}
    >
      {tag}
    </span>
  );
};

export default Tag;
