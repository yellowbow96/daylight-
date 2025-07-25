'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Music, Upload } from 'lucide-react';

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
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  const handleLoadMusic = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmbedUrl = getEmbedUrl(url);
    if (newEmbedUrl) {
      setEmbedUrl(newEmbedUrl);
    } else {
      alert('Invalid Spotify or YouTube URL. Please enter a valid URL for a track, album, playlist, or video.');
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music />
          Music Corner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLoadMusic} className="flex gap-2 mb-4">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Spotify or YouTube URL"
            aria-label="Music URL"
          />
          <Button type="submit" size="icon" aria-label="Load music">
            <Upload />
          </Button>
        </form>
        {embedUrl ? (
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              allow="encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>
        ) : (
           <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
            <p>Paste a music link to start.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
