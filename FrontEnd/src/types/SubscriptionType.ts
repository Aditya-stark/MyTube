interface Subscriber {
  _id: string;
  subscriber: {
    _id: string;
    username: string;
    avatar: string;
  };
  channel: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubscriberData {
  subscriberData: Subscriber[];
}

interface SubscribedTo {
  _id: string;
  subscriber: string;
  channel: {
    _id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubscribedToData {
  subscriberData: SubscribedTo[];
}
