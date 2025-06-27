
import { useState, useEffect } from 'react';
import { Playlist, PlaylistsByYear } from '@/types/playlist';

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistsByYear, setPlaylistsByYear] = useState<PlaylistsByYear>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const response = await fetch('/playlists_metadata.json');
        if (!response.ok) {
          throw new Error('Failed to load playlists');
        }
        
        const data: Playlist[] = await response.json();
        setPlaylists(data);
        
        // Group by year
        const grouped = data.reduce((acc: PlaylistsByYear, playlist) => {
          const year = new Date(playlist.publishedAt).getFullYear().toString();
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(playlist);
          return acc;
        }, {});
        
        setPlaylistsByYear(grouped);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, []);

  return { playlists, playlistsByYear, loading, error };
};
