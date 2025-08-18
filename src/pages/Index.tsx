import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { PlaylistCard } from '@/components/PlaylistCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { usePlaylists } from '@/hooks/usePlaylists';
import { useAudioFiles } from '@/hooks/useAudioFiles';
import PlaylistSearchInput from '@/components/PlaylistSearchInput';
import PaginatedPlaylists from '@/components/PaginatedPlaylists';
import { useAudioFolders } from '@/hooks/useAudioFolders';

const sanitizeForComparison = (text: string): string => {
  if (!text) return '';
  
  // Remove all types of quotes, including full-width quotes
  text = text.replace(/["\'\u201C\u201D\u2018\u2019´`＂‟"''\-–—]/g, '');
  
  // Normalize accents and convert to lowercase
  text = text
    .normalize('NFD') // Separate accents from letters
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .toLowerCase();
  
  // Remove special characters, punctuation, and symbols
  text = text.replace(/[^a-z0-9\s]/g, '');
  
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ');
  
  return text.trim();
};

const Index = () => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedPlaylists, setExpandedPlaylists] = useState<Set<string>>(new Set());
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const { playlistsByYear, loading, error, playlists: allPlaylists } = usePlaylists();
  const { audioFiles, loadingStates, fetchAudioFiles } = useAudioFiles();
  const { folders: audioFolders, loading: loadingFolders } = useAudioFolders();

  const years = Object.keys(playlistsByYear);
  const [search, setSearch] = useState("");

  const sanitizedAudioFolderNames = React.useMemo(
    () => new Set(audioFolders.map(folder => sanitizeForComparison(folder.title))),
    [audioFolders]
  );

  const currentPlaylists = selectedYear === 'Todas'
    ? allPlaylists.map(playlist => {
        // Procura áudios correspondentes no arquivos.json
        const audioPlaylist = audioFolders.find(folder => 
          folder.id === playlist.id || 
          sanitizeForComparison(folder.title) === sanitizeForComparison(playlist.title)
        );
        return {
          ...playlist,
          files: audioPlaylist ? audioPlaylist.files : []
        };
      })
    : selectedYear === 'Com Áudio'
      ? audioFolders.map(folder => ({
          id: folder.id,
          title: folder.title,
          description: folder.description || '',
          publishedAt: folder.publishedAt || '',
          itemCount: folder.itemCount || (folder.files ? folder.files.length : 0),
          files: folder.files
        }))
      : (selectedYear ? (playlistsByYear[selectedYear] || []).map(playlist => {
          // Procura áudios correspondentes no arquivos.json
          const audioPlaylist = audioFolders.find(folder => 
            folder.id === playlist.id || 
            sanitizeForComparison(folder.title) === sanitizeForComparison(playlist.title)
          );
          return {
            ...playlist,
            files: audioPlaylist ? audioPlaylist.files : []
          };
        }) : []);
  const filteredPlaylists = search.trim().length > 0
    ? currentPlaylists.filter((playlist) =>
        playlist.title.toLowerCase().includes(search.toLowerCase())
      )
    : currentPlaylists;

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
        <LoadingSpinner message="Carregando repositório..." />
      </div>
    );
  }

  if (selectedYear === 'Com Áudio' && loadingFolders) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner message="Buscando arquivos de áudio..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Erro</h1>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col md:flex-row">
      {/* Botão para abrir sidebar no mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-white border border-slate-200 rounded-lg p-2 shadow-md"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Abrir menu"
      >
        <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {/* Sidebar para desktop */}
      <div className="hidden md:block">
        <Sidebar
          years={years}
          selectedYear={selectedYear}
          onYearSelect={setSelectedYear}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Sidebar como drawer no mobile */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="bg-black bg-opacity-40 w-full h-full" onClick={() => setMobileSidebarOpen(false)}></div>
          <div className="relative z-50 w-64 max-w-full">
            <Sidebar
              years={years}
              selectedYear={selectedYear}
              onYearSelect={(year) => { setSelectedYear(year); setMobileSidebarOpen(false); }}
              isCollapsed={false}
              onToggle={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-3 sm:p-6">
            <header className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-center">
                Repositório
              </h1>
              <p className="text-slate-600 text-center max-w-2xl mx-auto">
                Ensinamentos oferecidos por Lama Padma Samten, organizados por ano e repositório do youtube.
              </p>
              <div className="mt-4 flex items-center gap-2">
                {selectedYear && selectedYear !== 'Todas' && (
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                    Ano: {selectedYear}
                  </div>
                )}
                {selectedYear === 'Todas' && (
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                    Todos os arquivos
                  </div>
                )}
                <PlaylistSearchInput value={search} onChange={setSearch} />
              </div>
            </header>

            {/* Paginação: 15 por página, botão ver mais */}
            {filteredPlaylists.length > 0 ? (
              <PaginatedPlaylists
                playlists={filteredPlaylists}
                audioFiles={audioFiles}
                loadingStates={loadingStates}
                expandedPlaylists={expandedPlaylists}
                handlePlaylistToggle={handlePlaylistToggle}
              />
            ) : selectedYear === 'Com Áudio' ? (
              <div className="text-center py-12">
                <p className="text-slate-600">Nenhum arquivo de áudio foi encontrado.</p>
              </div>
            ) : selectedYear ? (
              <div className="text-center py-12">
                <p className="text-slate-600">
                  Nenhum arquivo encontrado para {selectedYear}{search ? ` com o termo "${search}"` : ''}
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">Selecione um ano para ver os arquivos</p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
