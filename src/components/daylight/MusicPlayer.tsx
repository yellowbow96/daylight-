'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Music, Upload, FileAudio } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function getEmbedUrl(url: string): string | null {
  if (url.includes('spotify.com')) {
    const match = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
    if (match) {
      return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
    }
  } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoIdMatch = url.match(/(?:v=|\/|embed\/|youtu.be\/)([a-zA-Z0-9_-]{11})/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
  }
  return null;
}

export function MusicPlayer() {
  const [url, setUrl] = useState('');
  const [musicSource, setMusicSource] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<'embed' | 'audio' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleLoadMusic = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmbedUrl = getEmbedUrl(url);
    if (newEmbedUrl) {
      setMusicSource(newEmbedUrl);
      setSourceType('embed');
    } else {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL for a Spotify or YouTube.',
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        const fileUrl = URL.createObjectURL(file);
        setMusicSource(fileUrl);
        setSourceType('audio');
        setUrl('');
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please select an audio file.',
          variant: 'destructive',
        });
      }
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music />
          Music Corner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <form onSubmit={handleLoadMusic} className="flex-grow flex gap-2">
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Spotify or YouTube URL"
              aria-label="Music URL"
            />
            <Button type="submit" size="icon" aria-label="Load music from URL">
              <Upload />
            </Button>
          </form>
          <Input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="audio/*"
          />
          <Button onClick={handleUploadClick} size="icon" variant="outline" aria-label="Upload audio file">
            <FileAudio />
          </Button>
        </div>
        {sourceType === 'embed' && musicSource && (
          <div className="aspect-video">
            <iframe
              src={musicSource}
              width="100%"
              height="100%"
              allow="encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>
        )}
        {sourceType === 'audio' && musicSource && (
           <audio controls src={musicSource} className="w-full">
              Your browser does not support the audio element.
            </audio>
        )}
        {!musicSource && (
           <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
            <p>Paste a music link or upload an audio file.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
