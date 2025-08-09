export interface Video {
  _id: string;
  title: string;
  description: string;
  videoFile: string;
  thumbnail: string;
  duration: number; // in seconds
  views: number;
  isPublished: boolean;
  ownerDetails: {
    _id: string;
    fullName: string;
    avatar: string;
    username?: string;
    subscriberCount?: number; // number of subscribers
  };
  isSubscribed?: boolean; // indicates if the current user is subscribed to the video owner
  likesCount: number; // number of likes
  createdAt: string;
  updatedAt: string;
  __v: number;
  tags: string[];
  category: string;
}

export interface PublishVideo {
  _id: string;
  title: string;
  description: string;
  videoFile: string;
  thumbnail: string;
  tags: string;
  category: string;
  views: number;
  isPublished: boolean;
  owner: string; // only the id of the owner
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginatedVideos {
  videos: Video[];
  totalDocs: number;
  hasMoreVideos: boolean;
  lastVideoId: string;
}

export interface UploadVideoData {
  title: string;
  description: string;
  videoFile: File;
  thumbnail: File;
}
