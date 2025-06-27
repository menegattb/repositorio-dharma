
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
      console.log(`Fetching audio files for playlist: ${playlistId}`);
      const response = await fetch(`/api/audios.php?id=${playlistId}`);
      
      if (!response.ok) {
        console.log(`Failed to fetch audio files for ${playlistId}: ${response.status}`);
        // Don't throw error, just return empty array
        setAudioFiles(prev => ({ ...prev, [playlistId]: [] }));
        return [];
      }
      
      const files: AudioFile[] = await response.json();
      console.log(`Loaded ${files.length} audio files for playlist ${playlistId}`);
      setAudioFiles(prev => ({ ...prev, [playlistId]: files }));
      return files;
    } catch (error) {
      console.error(`Error fetching audio files for ${playlistId}:`, error);
      // Don't break the app, just return empty array
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
