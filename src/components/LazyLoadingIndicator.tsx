import React from 'react';
import { Loader2 } from 'lucide-react';

interface LazyLoadingIndicatorProps {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore?: () => void;
}

export const LazyLoadingIndicator: React.FC<LazyLoadingIndicatorProps> = ({
  isLoading,
  hasMore,
  onLoadMore
}) => {
  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm">
          <span>✨</span>
          <span>Todos os arquivos foram carregados</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 text-blue-700 rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Carregando mais arquivos...</span>
        </div>
      </div>
    );
  }

  if (onLoadMore) {
    return (
      <div className="text-center py-8">
        <button
          onClick={onLoadMore}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <span>Carregar mais arquivos</span>
          <span className="text-blue-200">↓</span>
        </button>
      </div>
    );
  }

  return null;
}; 