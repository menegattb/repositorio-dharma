
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
      const response = await fetch(`/api/audios.php?id=${playlistId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch audio files');
      }
      
      const files: AudioFile[] = await response.json();
      setAudioFiles(prev => ({ ...prev, [playlistId]: files }));
      return files;
    } catch (error) {
      console.error('Error fetching audio files:', error);
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
