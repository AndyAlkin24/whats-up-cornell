
import React from 'react';
import CreatePostForm from '@/components/CreatePostForm';
import PostFeed from '@/components/PostFeed';
import { PostProvider } from '@/contexts/PostContext';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  return (
    <PostProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-cornell-red py-4 sticky top-0 z-10 shadow-md">
          <div className="container max-w-2xl mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              What'sUp@Cornell
            </h1>
          </div>
        </header>
        
        <main className="container max-w-2xl mx-auto px-4 py-6">
          <CreatePostForm />
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Happening Now</h2>
            <p className="text-sm text-gray-500">All posts disappear after 12 hours</p>
          </div>
          <PostFeed />
        </main>
        
        <footer className="bg-white py-4 border-t border-gray-200">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            <p>Anonymous. No tracking. No profiles.</p>
            <p className="mt-1">Posts automatically expire after 12 hours.</p>
          </div>
        </footer>
      </div>
      <Toaster />
    </PostProvider>
  );
};

export default Index;
