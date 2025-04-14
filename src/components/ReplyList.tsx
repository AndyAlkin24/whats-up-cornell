
import React, { useState, useEffect } from 'react';
import { usePostContext } from '@/contexts/PostContext';
import { Reply } from '@/types/reply';
import ReplyItem from './ReplyItem';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface ReplyListProps {
  postId: string;
}

const ReplyList = ({ postId }: ReplyListProps) => {
  const { getRepliesForPost } = usePostContext();
  const [expanded, setExpanded] = useState(true);

  const { data: replies = [], isLoading, refetch } = useQuery({
    queryKey: ['replies', postId],
    queryFn: () => getRepliesForPost(postId),
  });

  // Add a useEffect to refetch replies when the component mounts
  useEffect(() => {
    refetch();
  }, [postId, refetch]);

  if (isLoading) {
    return <div className="pl-6 py-2 text-sm text-gray-500">Loading replies...</div>;
  }

  if (replies.length === 0) {
    return <div className="pl-6 py-2 text-sm text-gray-500">No replies yet. Be the first!</div>;
  }

  return (
    <div className="mt-2">
      <div className="flex items-center mb-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 p-0 h-auto"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4 mr-1" />
          ) : (
            <ChevronDown className="h-4 w-4 mr-1" />
          )}
          <span className="text-sm">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
        </Button>
      </div>
      
      {expanded && (
        <div>
          {replies.map(reply => (
            <ReplyItem key={reply.id} reply={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplyList;
