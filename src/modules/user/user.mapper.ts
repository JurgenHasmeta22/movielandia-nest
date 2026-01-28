import { Injectable } from "@nestjs/common";

@Injectable()
export class UserMapper {
    mapUserToProfile(user: any): any {
        return {
            id: user.id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            createdAt: user.createdAt,
            followersCount: user.followersCount || 0,
            followingCount: user.followingCount || 0,
            reviewsCount: user.reviewsCount || 0,
            favoritesCount: user.favoritesCount || 0,
        };
    }

    mapMessageToDto(message: any): any {
        return {
            id: message.id,
            text: message.text,
            sender: {
                id: message.sender.id,
                userName: message.sender.userName,
                email: message.sender.email,
                avatar: message.sender.avatar,
            },
            receiver: {
                id: message.receiver.id,
                userName: message.receiver.userName,
                email: message.receiver.email,
                avatar: message.receiver.avatar,
            },
            createdAt: message.createdAt,
            isRead: message.isRead || false,
        };
    }

    mapFollowToDto(follow: any): any {
        return {
            id: follow.id,
            follower: {
                id: follow.follower.id,
                userName: follow.follower.userName,
                email: follow.follower.email,
                avatar: follow.follower.avatar,
            },
            following: {
                id: follow.following.id,
                userName: follow.following.userName,
                email: follow.following.email,
                avatar: follow.following.avatar,
            },
            state: follow.state,
            createdAt: follow.createdAt,
        };
    }

    mapFavoriteToDto(favorite: any, type: string): any {
        if (type === "movies" || type === "series") {
            return {
                id: favorite.movie?.id || favorite.serie?.id,
                title: favorite.movie?.title || favorite.serie?.title,
                image: favorite.movie?.posterPath || favorite.serie?.posterPath,
            };
        } else if (type === "actors" || type === "crew") {
            return {
                id: favorite.actor?.id || favorite.crew?.id,
                fullname: favorite.actor?.fullname || favorite.crew?.fullname,
                image: favorite.actor?.profilePath || favorite.crew?.profilePath,
            };
        }
        return favorite;
    }
}
