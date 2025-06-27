
import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { PlaylistCard } from '@/components/PlaylistCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { usePlaylists } from '@/hooks/usePlaylists';
import { useAudioFiles } from '@/hooks/useAudioFiles';

const Index = () => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedPlaylists, setExpandedPlaylists] = useState<Set<string>>(new Set());
  
  const { playlistsByYear, loading, error } = usePlaylists();
  const { audioFiles, loadingStates, fetchAudioFiles } = useAudioFiles();

  const years = Object.keys(playlistsByYear);
  const currentPlaylists = selectedYear ? playlistsByYear[selectedYear] || [] : [];

  // Auto-select most recent year when data loads
  useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      const mostRecentYear = years.sort((a, b) => parseInt(b) - parseInt(a))[0];
      setSelectedYear(mostRecentYear);
    }
  }, [years, selectedYear]);

  const handlePlaylistToggle = async (playlistId: string) => {
    const newExpanded = new Set(expandedPlaylists);
    
    if (expandedPlaylists.has(playlistId)) {
      newExpanded.delete(playlistId);
    } else {
      newExpanded.add(playlistId);
      // Fetch audio files when expanding
      await fetchAudioFiles(playlistId);
    }
    
    setExpandedPlaylists(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner message="Loading playlists..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <Sidebar
        years={years}
        selectedYear={selectedYear}
        onYearSelect={setSelectedYear}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Linhas Temáticas
              </h1>
              <p className="text-slate-600">
                Explore our collection of thematic audio playlists
              </p>
              {selectedYear && (
                <div className="mt-4 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Year: {selectedYear}
                </div>
              )}
            </header>

            {currentPlaylists.length > 0 ? (
              <div className="space-y-6">
                {currentPlaylists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    audioFiles={audioFiles[playlist.id] || []}
                    isLoading={loadingStates[playlist.id] || false}
                    onToggleExpand={() => handlePlaylistToggle(playlist.id)}
                    isExpanded={expandedPlaylists.has(playlist.id)}
                  />
                ))}
              </div>
            ) : selectedYear ? (
              <div className="text-center py-12">
                <p className="text-slate-600">No playlists found for {selectedYear}</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">Select a year to view playlists</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
