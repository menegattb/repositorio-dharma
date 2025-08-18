import { useState, useEffect } from 'react';

export interface AudioFile {
  filename: string;
  url: string;
}

export interface AudioFolder {
  id: string;
  title: string;
  description?: string;
  publishedAt?: string;
  itemCount?: number;
  files: AudioFile[];
}

export const useAudioFolders = () => {
  const [folders, setFolders] = useState<AudioFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/repositorio/arquivos.json');
        if (!response.ok) {
          throw new Error('Erro ao buscar playlists com áudios');
        }
        const data = await response.json();
        setFolders(data); // data já tem id, title, files, etc
      } catch (err) {
        console.error('Error fetching audio folders:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, []);

  return { folders, loading, error };
};
