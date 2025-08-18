import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Music, Play, Loader2 } from 'lucide-react';
import { Playlist, AudioFile } from '@/types/playlist';
import { cn } from '@/lib/utils';
import { useEnvironment } from '@/hooks/useEnvironment';

interface PlaylistCardProps {
  playlist: Playlist;
  audioFiles: AudioFile[];
  isLoading: boolean;
  onToggleExpand: () => void;
  isExpanded: boolean;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  audioFiles,
  isLoading,
  onToggleExpand,
  isExpanded
}) => {
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const { baseUrl } = useEnvironment();

  const handleYouTubeClick = () => {
    window.open(`https://www.youtube.com/playlist?list=${playlist.id}`, '_blank');
  };

  const handleAudioPlay = (audioUrl: string) => {
    console.log(`🎯 Botão play clicado!`);
    console.log(`🎵 URL do áudio: ${audioUrl}`);
    
    // Usa a URL diretamente (já está correta do script)
    setCurrentAudio(audioUrl);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-6 flex flex-col items-stretch">
        <h3 className="text-xl font-semibold text-slate-800 mb-2 w-full text-left">
          {playlist.title}
        </h3>
        <p className="text-sm text-slate-500 mb-4 w-full text-left">
          Publicado em {formatDate(playlist.publishedAt)}
        </p>
        {audioFiles.length > 0 && (
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-2 w-full p-3 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg transition-all duration-200 text-blue-700 font-medium border border-blue-400"
          >
            <Music className="w-4 h-4" />
            <span>Arquivos de Áudio</span>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin ml-auto" />
            ) : (
              <div className="ml-auto">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            )}
          </button>
        )}
        {isExpanded && audioFiles.length > 0 && (
          <div className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden mb-4",
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}>
            <div className="px-0 pb-0 border-t-0 pt-0">
              {audioFiles.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {audioFiles.map((file, index) => (
                    <div
                      key={index}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group">
                        <button
                          onClick={() => {
                            console.log(`🎵 Clicando no botão play para: ${file.filename}`);
                            handleAudioPlay(file.url);
                          }}
                          className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Play className="w-3 h-3" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {file.filename}
                          </p>
                        </div>
                      </div>
                      {currentAudio === file.url && (
                        <div className="px-3 pb-2">
                          <audio
                            controls
                            className="w-full"
                            src={currentAudio}
                            onEnded={() => setCurrentAudio(null)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                !isLoading && (
                  <p className="text-slate-500 text-sm text-center py-4">
                    Não constam áudios disponíveis.
                  </p>
                )
              )}
            </div>
          </div>
        )}
        {playlist.description && (
          <p className="text-slate-600 mb-4 text-sm leading-relaxed w-full text-left">
            {playlist.description}
          </p>
        )}
        <div className="flex justify-center mt-2">
          <button
            onClick={handleYouTubeClick}
            className="flex items-center gap-2 px-6 py-2 border border-red-600 text-red-600 bg-white rounded-lg hover:bg-red-50 transition-colors text-base font-medium mx-auto"
          >
            <ExternalLink className="w-5 h-5" />
            Ver no YouTube
          </button>
        </div>
      </div>
    </div>
  );
};
