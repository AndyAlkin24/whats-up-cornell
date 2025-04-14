
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePostContext } from '@/contexts/PostContext';
import { Input } from '@/components/ui/input';
import { MessageCircle } from 'lucide-react';

interface ReplyFormProps {
  postId: string;
  onCancel: () => void;
}

const ReplyForm = ({ postId, onCancel }: ReplyFormProps) => {
  const [message, setMessage] = useState('');
  const { addReplyToPost } = usePostContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }
    
    console.log('Submitting reply:', { postId, message });
    addReplyToPost(postId, message);
    setMessage('');
    onCancel();
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-2 mb-4 pl-6 border-l-2 border-gray-200">
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center mb-2">
          <MessageCircle className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm font-medium">Reply to this post</span>
        </div>
        
        <Input
          placeholder="Type your reply..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mb-2 text-sm"
        />
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            variant="default"
            disabled={!message.trim()}
            className="bg-cornell-red hover:bg-cornell-red/90"
          >
            Reply
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ReplyForm;
