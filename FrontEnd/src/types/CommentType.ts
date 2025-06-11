export interface Comment {
  _id: string;
  commentContent: string;
  createdAt: string;
  updatedAt: string;
  ownerDetails: {
    _id: string;
    fullName: string;
    avatar: string;
    username: string;
    email: string;
  };
  likesCount?: number;
  isLiked?: boolean;
}

export interface PaginatedComments {
  comments: Comment[];
  totalComments: number;
  hasMore: boolean;
}
