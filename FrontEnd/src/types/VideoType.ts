export interface Video {
  _id: string;
  title: string;
  description: string;
  videoFile: string;
  thumbnail: string;
  views: number;
  isPublished: boolean;
  owner: {
    _id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PublishVideo {
  _id: string;
  title: string;
  description: string;
  videoFile: string;
  thumbnail: string;
  views: number;
  isPublished: boolean;
  owner: string; // only the id of the owner
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginatedVideos {
  docs: Video[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: 1;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface UploadVideoData {
  title: string;
  description: string;
  videoFile: File;
  thumbnail: File;
}
