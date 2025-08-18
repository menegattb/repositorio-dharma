import { useState, useEffect } from 'react';

export const useEnvironment = () => {
  const [isLocal, setIsLocal] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    
    setIsLocal(isLocalhost);
    
    if (isLocalhost) {
      // Local: usa a pasta public
      setBaseUrl('/repositorio/audios');
    } else {
      // Produção: usa o domínio completo
      setBaseUrl('https://repositorio.acaoparamita.com.br/repositorio/audios');
    }
    
    console.log(`🌍 Ambiente detectado: ${isLocalhost ? 'Local' : 'Produção'}`);
    console.log(`🔗 Base URL: ${isLocalhost ? '/repositorio/audios' : 'https://repositorio.acaoparamita.com.br/repositorio/audios'}`);
  }, []);

  return {
    isLocal,
    baseUrl,
    isProduction: !isLocal
  };
}; 