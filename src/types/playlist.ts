
export interface Playlist {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  itemCount: number;
}

export interface AudioFile {
  filename: string;
  url: string;
}

export interface PlaylistsByYear {
  [year: string]: Playlist[];
}
