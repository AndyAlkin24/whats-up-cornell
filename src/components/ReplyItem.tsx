
import React from 'react';
import { Reply } from '@/types/reply';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { usePostContext } from '@/contexts/PostContext';
import { formatDistanceToNow } from 'date-fns';

interface ReplyItemProps {
  reply: Reply;
}

const ReplyItem = ({ reply }: ReplyItemProps) => {
  const { incrementReplyPullingUp, incrementReplyFade } = usePostContext();
  
  const handlePullingUp = () => {
    incrementReplyPullingUp(reply.id);
  };
  
  const handleFade = () => {
    incrementReplyFade(reply.id);
  };
  
  return (
    <div className="pl-6 border-l-2 border-gray-200 mb-3">
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
          </div>
        </div>
        
        <p className="text-sm mb-2">{reply.message}</p>
        
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="h-7 text-xs border-cornell-red text-cornell-red hover:bg-cornell-red/10 flex items-center gap-1"
            onClick={handlePullingUp}
          >
            <ThumbsUp className="h-3 w-3" />
            <span>Pulling Up</span>
            {reply.pullingup > 0 && (
              <span className="ml-1 bg-cornell-red text-white px-1.5 py-0.5 rounded-full text-xs">
                {reply.pullingup}
              </span>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-7 text-xs border-gray-500 text-gray-500 hover:bg-gray-500/10 flex items-center gap-1"
            onClick={handleFade}
          >
            <ThumbsDown className="h-3 w-3" />
            <span>Fade</span>
            {reply.fade > 0 && (
              <span className="ml-1 bg-gray-500 text-white px-1.5 py-0.5 rounded-full text-xs">
                {reply.fade}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;
