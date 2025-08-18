
import { useState, useCallback } from 'react';
import { AudioFile } from '@/types/playlist';

export const useAudioFiles = () => {
  const [audioFiles, setAudioFiles] = useState<{ [playlistId: string]: AudioFile[] }>({});
  const [loadingStates, setLoadingStates] = useState<{ [playlistId: string]: boolean }>({});

  const fetchAudioFiles = useCallback(async (playlistId: string) => {
    if (audioFiles[playlistId]) {
      return audioFiles[playlistId];
    }

    setLoadingStates(prev => ({ ...prev, [playlistId]: true }));
    
    try {
      const response = await fetch('/repositorio/arquivos.json');
      if (!response.ok) {
        setAudioFiles(prev => ({ ...prev, [playlistId]: [] }));
        return [];
      }
      const playlists = await response.json();
      const playlist = playlists.find((p: any) => p.id === playlistId);
      const files: AudioFile[] = playlist && playlist.files ? playlist.files : [];
      setAudioFiles(prev => ({ ...prev, [playlistId]: files }));
      return files;
    } catch (error) {
      setAudioFiles(prev => ({ ...prev, [playlistId]: [] }));
      return [];
    } finally {
      setLoadingStates(prev => ({ ...prev, [playlistId]: false }));
    }
  }, [audioFiles]);

  return {
    audioFiles,
    loadingStates,
    fetchAudioFiles
  };
};
