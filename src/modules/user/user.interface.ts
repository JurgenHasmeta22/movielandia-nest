export interface IUser {
    id: number;
    userName: string;
    email: string;
    avatar?: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserProfile extends IUser {
    followersCount: number;
    followingCount: number;
    reviewsCount: number;
    favoritesCount: number;
    isFollowed?: boolean;
    isFollowedStatus?: string;
}

export interface IFavorite {
    id: number;
    title?: string;
    fullname?: string;
    image?: string;
}

export interface IMessage {
    id: number;
    text: string;
    sender: IUser;
    receiver: IUser;
    createdAt: Date;
    isRead: boolean;
}

export interface IFollow {
    id: number;
    follower: IUser;
    following: IUser;
    state: "pending" | "accepted";
    createdAt: Date;
}

export interface IReview {
    id: number;
    content: string;
    rating: number;
    itemId: number;
    itemType: string;
    user: IUser;
    createdAt: Date;
}
