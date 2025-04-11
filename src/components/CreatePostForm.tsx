
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { TagType } from '@/types/post';
import { usePostContext } from '@/contexts/PostContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const AVAILABLE_TAGS: TagType[] = ['Chill', 'Party', 'Food', 'Hookup vibes', 'Study session'];

const CreatePostForm = () => {
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const { addPost } = usePostContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }
    
    addPost(
      message.trim(), 
      location.trim() || undefined, 
      selectedTags
    );
    
    // Clear form
    setMessage('');
    setLocation('');
    setSelectedTags([]);
  };

  const toggleTag = (tag: TagType) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl text-center text-cornell-red">What's happening at Cornell?</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">What's happening?</Label>
            <Textarea
              id="message"
              placeholder="Playing Smash in Low Rise 6, come thru"
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="resize-none"
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              placeholder="e.g., Low Rise 6, Duffield Hall, Collegetown"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Tags (optional)</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {AVAILABLE_TAGS.map(tag => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`tag-${tag}`} 
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => toggleTag(tag)}
                  />
                  <Label 
                    htmlFor={`tag-${tag}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-cornell-red hover:bg-cornell-red/90"
          >
            Post Anonymously
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreatePostForm;
