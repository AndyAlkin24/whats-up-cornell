
export type TagType = 'Chill' | 'Party' | 'Food' | 'Hookup vibes' | 'Study session';

export interface Post {
  id: string;
  message: string;
  location?: string;
  tags: TagType[];
  timestamp: number;
  pullingUp: number;
  fade: number;
}
