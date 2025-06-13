export interface Tweet {
  _id: string;
  content: string;
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

export interface PaginatedTweets {
  comments: Comment[];
  totalComments: number;
  hasMore: boolean;
}
