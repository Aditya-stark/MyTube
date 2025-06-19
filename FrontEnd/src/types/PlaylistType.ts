import { Video } from "./VideoType";

export interface Playlist {
  _id: string;
  name: string;
  description: string;
  owner: {
    _id: string;
    fullName: string;
    avatar: string;
    username: string;
    email: string;
  };
  video: Video[]; // Changed from 'videos' to 'video' to match backend
  published?: boolean;
  createdAt: string;
  updatedAt: string;
}
