
# Linhas Temáticas - Audio Playlist Manager

A modern single-page web application for managing and browsing audio playlists with YouTube integration.

## Features

- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎵 **Audio File Management** - Browse and play audio files organized by playlist
- 📅 **Year-based Navigation** - Collapsible sidebar for easy navigation by publication year
- 🔗 **YouTube Integration** - Direct links to YouTube playlists
- 🎨 **Modern UI** - Clean, gradient-based design with smooth animations
- ⚡ **Fast Loading** - Optimized React app with lazy loading

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide React Icons
- **Backend**: PHP (for audio file API)
- **Deployment**: SSH to Hostinger shared hosting

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Deploy to server:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── Sidebar.tsx     # Year navigation sidebar
│   │   ├── PlaylistCard.tsx # Individual playlist display
│   │   └── LoadingSpinner.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── usePlaylists.ts # Playlist data management
│   │   └── useAudioFiles.ts # Audio file fetching
│   ├── types/              # TypeScript type definitions
│   └── pages/Index.tsx     # Main application page
├── public/
│   ├── playlists_metadata.json  # Playlist metadata
│   ├── api/audios.php      # PHP API for audio files
│   └── audio/              # Audio files directory
│       └── {playlistId}/   # Individual playlist audio folders
├── deploy.sh               # Deployment script
└── .htaccess              # Apache configuration for SPA routing
```

## Configuration

### Audio Files
Place audio files in the following structure:
```
public/audio/{playlistId}/*.mp3
```

Example:
```
public/audio/PLO_7Zoueaxd6Uc3YrXmsbd-V5SZhQCJGY/01 - Introduction.mp3
```

### Playlist Metadata
Update `public/playlists_metadata.json` with your playlist information:

```json
[
  {
    "id": "PLO_7Zoueaxd6Uc3YrXmsbd-V5SZhQCJGY",
    "title": "Your Playlist Title",
    "description": "Description of the playlist",
    "publishedAt": "2025-05-28T18:28:04.431041Z",
    "itemCount": 10
  }
]
```

### Deployment Configuration
Update the deployment settings in `deploy.sh`:

```bash
REMOTE_USER="your_username"
REMOTE_HOST="your_host"
REMOTE_PORT="your_ssh_port"
REMOTE_PATH="/path/to/your/domain"
SITE_URL="https://your-domain.com"
```

## API Endpoints

### Get Audio Files
```
GET /api/audios.php?id={playlistId}
```

Returns:
```json
[
  {
    "filename": "01 - Introduction.mp3",
    "url": "/audio/PLO_7Zoueaxd6Uc3YrXmsbd-V5SZhQCJGY/01%20-%20Introduction.mp3"
  }
]
```

## Development

The application uses modern React patterns with TypeScript for type safety. Key features include:

- **Custom Hooks**: Separation of concerns with `usePlaylists` and `useAudioFiles`
- **Component Architecture**: Modular components for maintainability
- **State Management**: React state with proper loading and error handling
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Deployment

The deployment script (`deploy.sh`) handles:
- Building the React application
- Copying necessary configuration files
- Uploading via SSH/rsync
- Verifying deployment success

Live site: https://linhastematicas.acaoparamita.com.br

## License

This project is designed for the Ação Paramita organization.
