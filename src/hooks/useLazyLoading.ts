import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export const useLazyLoading = <T>(
  items: T[],
  pageSize: number = 15,
  options: UseLazyLoadingOptions = {}
) => {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const { threshold = 0.1, rootMargin = '100px', enabled = true } = options;

  // Carrega mais itens
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const startTime = performance.now();
    
    // Simula um pequeno delay para mostrar loading
    setTimeout(() => {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const newItems = items.slice(startIndex, endIndex);
      
      setVisibleItems(prev => [...prev, ...newItems]);
      setCurrentPage(prev => prev + 1);
      setHasMore(endIndex < items.length);
      setIsLoading(false);
      
      const endTime = performance.now();
      console.log(`🚀 Lazy Loading: ${newItems.length} playlists carregadas em ${(endTime - startTime).toFixed(2)}ms (Página ${currentPage})`);
    }, 100);
  }, [currentPage, pageSize, items, isLoading, hasMore]);

  // Carrega itens iniciais
  useEffect(() => {
    if (items.length > 0) {
      const initialItems = items.slice(0, pageSize);
      setVisibleItems(initialItems);
      setCurrentPage(1);
      setHasMore(items.length > pageSize);
      console.log(`🎯 Lazy Loading: ${initialItems.length} itens iniciais carregados de ${items.length} total`);
    }
  }, [items, pageSize]);

  // Reset quando os itens mudam
  useEffect(() => {
    console.log(`🔄 Lazy Loading: Resetando - ${items.length} itens totais, pageSize: ${pageSize}`);
    setVisibleItems([]);
    setCurrentPage(1);
    setHasMore(items.length > pageSize);
  }, [items, pageSize]);

  // Configura o Intersection Observer
  useEffect(() => {
    console.log(`👁️ Lazy Loading: Configurando observer - enabled: ${enabled}, hasMore: ${hasMore}, isLoading: ${isLoading}`);
    
    if (!enabled || !loadingRef.current) {
      console.log(`❌ Lazy Loading: Observer não configurado - enabled: ${enabled}, ref: ${!!loadingRef.current}`);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        console.log(`👀 Lazy Loading: Intersection detectada - isIntersecting: ${entry.isIntersecting}`);
        if (entry.isIntersecting && hasMore && !isLoading) {
          console.log(`🚀 Lazy Loading: Iniciando carregamento automático`);
          loadMore();
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current = observer;
    observer.observe(loadingRef.current);
    console.log(`✅ Lazy Loading: Observer configurado com sucesso`);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        console.log(`🔌 Lazy Loading: Observer desconectado`);
      }
    };
  }, [enabled, hasMore, isLoading, loadMore, threshold, rootMargin]);

  return {
    visibleItems,
    isLoading,
    hasMore,
    loadingRef,
    loadMore,
    currentPage,
    totalItems: items.length
  };
}; 