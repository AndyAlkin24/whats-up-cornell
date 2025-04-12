
import React, { useState } from 'react';
import { Post } from '@/types/post';
import { Button } from '@/components/ui/button';
import { MapPin, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import Tag from '@/components/Tag';
import { usePostContext } from '@/contexts/PostContext';
import { formatDistanceToNow } from 'date-fns';
import ReplyForm from './ReplyForm';
import ReplyList from './ReplyList';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { incrementPullingUp, incrementFade, getRepliesForPost } = usePostContext();
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const isMobile = useIsMobile();
  
  const { data: replies = [] } = useQuery({
    queryKey: ['replies', post.id],
    queryFn: () => getRepliesForPost(post.id),
  });
  
  const handlePullingUp = () => {
    incrementPullingUp(post.id);
  };
  
  const handleFade = () => {
    incrementFade(post.id);
  };

  const toggleReplying = () => {
    setIsReplying(!isReplying);
    if (!isReplying && !showReplies) {
      setShowReplies(true);
    }
  };
  
  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm text-gray-500">
          {formatDistanceToNow(post.timestamp, { addSuffix: true })}
        </div>
      </div>
      
      <p className="text-lg font-medium mb-2">{post.message}</p>
      
      {post.location && (
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{post.location}</span>
        </div>
      )}
      
      {post.tags && post.tags.length > 0 && (
        <div className="mb-4">
          {post.tags.map(tag => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
      )}
      
      <div className={`flex ${isMobile ? 'flex-col gap-2' : 'justify-between items-center'} mt-2`}>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm"
            className="border-cornell-red text-cornell-red hover:bg-cornell-red/10 flex items-center gap-1"
            onClick={handlePullingUp}
          >
            <ThumbsUp className="h-4 w-4" />
            I'm Pulling Up
            {post.pullingUp > 0 && (
              <span className="ml-1 bg-cornell-red text-white px-2 py-0.5 rounded-full text-xs">
                {post.pullingUp}
              </span>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-500 text-gray-500 hover:bg-gray-500/10 flex items-center gap-1"
            onClick={handleFade}
          >
            <ThumbsDown className="h-4 w-4" />
            Fade
            {post.fade > 0 && (
              <span className="ml-1 bg-gray-500 text-white px-2 py-0.5 rounded-full text-xs">
                {post.fade}
              </span>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {replies.length > 0 && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1"
              onClick={toggleReplies}
            >
              <MessageCircle className="h-3 w-3" />
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleReplying}
            className={`text-gray-600 hover:text-cornell-red hover:bg-cornell-red/10 ${isMobile ? 'self-start' : ''}`}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Reply
          </Button>
        </div>
      </div>

      {isReplying && (
        <ReplyForm 
          postId={post.id} 
          onCancel={() => setIsReplying(false)} 
        />
      )}

      {showReplies && (
        <div className="mt-3">
          <ReplyList postId={post.id} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
