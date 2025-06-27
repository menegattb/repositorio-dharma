
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Music, Play, Loader2 } from 'lucide-react';
import { Playlist, AudioFile } from '@/types/playlist';
import { cn } from '@/lib/utils';

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

  const handleYouTubeClick = () => {
    window.open(`https://www.youtube.com/playlist?list=${playlist.id}`, '_blank');
  };

  const handleAudioPlay = (audioUrl: string) => {
    setCurrentAudio(audioUrl);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {playlist.title}
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              Published on {formatDate(playlist.publishedAt)}
            </p>
            <p className="text-sm text-slate-600">
              {playlist.itemCount} items
            </p>
          </div>
          
          <button
            onClick={handleYouTubeClick}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            YouTube
          </button>
        </div>

        {playlist.description && (
          <p className="text-slate-600 mb-4 text-sm leading-relaxed">
            {playlist.description}
          </p>
        )}

        <button
          onClick={onToggleExpand}
          className="flex items-center gap-2 w-full p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg transition-all duration-200 text-blue-700 font-medium"
        >
          <Music className="w-4 h-4" />
          <span>Audio Files</span>
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
      </div>

      <div className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden",
        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-6 pb-6 border-t border-slate-100 pt-4">
          {audioFiles.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {audioFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                >
                  <button
                    onClick={() => handleAudioPlay(file.url)}
                    className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {file.filename}
                    </p>
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          ) : (
            !isLoading && (
              <p className="text-slate-500 text-sm text-center py-4">
                No audio files found for this playlist.
              </p>
            )
          )}
        </div>
      </div>

      {currentAudio && (
        <div className="px-6 pb-4">
          <audio
            controls
            className="w-full"
            src={currentAudio}
            onEnded={() => setCurrentAudio(null)}
          />
        </div>
      )}
    </div>
  );
};
