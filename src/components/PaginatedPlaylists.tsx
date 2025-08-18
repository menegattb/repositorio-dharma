import React from 'react';
import { PlaylistCard } from './PlaylistCard';
import { AudioFolder } from '@/hooks/useAudioFolders';
import { useLazyLoading } from '@/hooks/useLazyLoading';
import { LazyLoadingIndicator } from './LazyLoadingIndicator';

interface PaginatedPlaylistsProps {
  playlists: any[];
  audioFiles: { [playlistId: string]: any[] };
  loadingStates: { [playlistId: string]: boolean };
  expandedPlaylists: Set<string>;
  handlePlaylistToggle: (playlistId: string) => void;
}

const PaginatedPlaylists: React.FC<PaginatedPlaylistsProps> = ({ 
  playlists, 
  audioFiles, 
  loadingStates, 
  expandedPlaylists, 
  handlePlaylistToggle 
}) => {
  console.log(`📊 PaginatedPlaylists: Recebendo ${playlists.length} arquivos`);
  
  const {
    visibleItems: visiblePlaylists,
    isLoading,
    hasMore,
    loadingRef
  } = useLazyLoading(playlists, 12, {
    threshold: 0.1,
    rootMargin: '200px'
  });

  console.log(`🎯 PaginatedPlaylists: ${visiblePlaylists.length} arquivos visíveis, hasMore: ${hasMore}, isLoading: ${isLoading}`);

  return (
    <>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        {visiblePlaylists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            audioFiles={
              // If it's an audio folder, use its files directly
              'files' in playlist 
                ? playlist.files 
                : (audioFiles[playlist.id] || [])
            }
            isLoading={loadingStates[playlist.id] || false}
            onToggleExpand={() => handlePlaylistToggle(playlist.id)}
            isExpanded={expandedPlaylists.has(playlist.id)}
          />
        ))}
      </div>
      
      {/* Indicador de lazy loading */}
      <div ref={loadingRef} className="min-h-[100px]">
        <LazyLoadingIndicator 
          isLoading={isLoading}
          hasMore={hasMore}
        />
      </div>
    </>
  );
};

export default PaginatedPlaylists;
