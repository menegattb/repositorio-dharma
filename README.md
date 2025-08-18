
# Repositório - Ensinamentos Lama Padma Samten

Uma aplicação web moderna de página única para gerenciar e navegar por playlists de áudio com integração do YouTube, apresentando ensinamentos de Lama Padma Samten.

## ✨ Características

- **Interface Moderna**: Design responsivo e intuitivo com Tailwind CSS
- **Navegação por Ano**: Organize playlists por período cronológico
- **Reprodução de Áudio**: Player HTML5 integrado para arquivos MP3
- **Integração YouTube**: Links diretos para playlists do YouTube
- **Lazy Loading**: Carregamento eficiente de playlists
- **Metadados Ricos**: Informações detalhadas sobre cada playlist

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Deploy**: SSH/rsync para Hostinger

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Build para Produção
```bash
npm run build
```

### Deploy
```bash
./deploy.sh
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
├── hooks/              # Hooks customizados
├── pages/              # Páginas da aplicação
├── types/              # Definições TypeScript
└── utils/              # Funções utilitárias

public/
└── linhastematicas/    # Arquivos estáticos e áudios

scripts/                # Scripts de automação
```

## 🔧 Scripts Disponíveis

- `gerar_playlists_json.cjs`: Gera arquivo JSON com metadados das playlists
- `deploy.sh`: Script de deploy automatizado para Hostinger

## 🌐 Site ao Vivo

**Site ao vivo**: https://repositorio.acaoparamita.com.br

## 📝 Licença

Este projeto é desenvolvido para a preservação e disseminação dos ensinamentos de Lama Padma Samten.
