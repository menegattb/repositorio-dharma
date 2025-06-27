
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
        // Try multiple possible paths for the JSON file
        const possiblePaths = [
          '/playlists_metadata.json',
          './playlists_metadata.json',
          '/linhastematicas/playlists_metadata.json'
        ];

        let response = null;
        let lastError = null;

        for (const path of possiblePaths) {
          try {
            console.log(`Trying to load playlists from: ${path}`);
            response = await fetch(path);
            if (response.ok) {
              console.log(`Successfully loaded from: ${path}`);
              break;
            } else {
              console.log(`Failed to load from ${path}: ${response.status}`);
            }
          } catch (err) {
            console.log(`Error trying ${path}:`, err);
            lastError = err;
          }
        }

        if (!response || !response.ok) {
          throw new Error(`Failed to load playlists from all paths. Last error: ${lastError}`);
        }
        
        const data: Playlist[] = await response.json();
        console.log('Loaded playlists:', data);
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
        console.error('Error loading playlists:', err);
        setError(err instanceof Error ? err.message : 'An error occurred loading playlists');
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, []);

  return { playlists, playlistsByYear, loading, error };
};
