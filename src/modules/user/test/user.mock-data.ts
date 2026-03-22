export const userMockData = {
    users: [
        {
            id: 1,
            userName: "john_doe",
            email: "john@example.com",
            avatar: "https://example.com/avatars/john.jpg",
            bio: "Movie enthusiast",
            createdAt: new Date("2024-01-01"),
        },
        {
            id: 2,
            userName: "jane_smith",
            email: "jane@example.com",
            avatar: "https://example.com/avatars/jane.jpg",
            bio: "Series lover",
            createdAt: new Date("2024-01-15"),
        },
    ],
    userProfile: {
        id: 1,
        userName: "john_doe",
        email: "john@example.com",
        avatar: "https://example.com/avatars/john.jpg",
        bio: "Movie enthusiast",
        createdAt: new Date("2024-01-01"),
        followersCount: 150,
        followingCount: 75,
        reviewsCount: 42,
        favoritesCount: 89,
    },
    messages: [
        {
            id: 1,
            text: "Hey, how are you?",
            sender: { id: 1, userName: "john_doe", email: "john@example.com" },
            receiver: { id: 2, userName: "jane_smith", email: "jane@example.com" },
            createdAt: new Date(),
            isRead: false,
        },
    ],
    favorites: [
        {
            id: 101,
            title: "Inception",
            image: "https://example.com/movies/inception.jpg",
        },
        {
            id: 102,
            title: "Breaking Bad",
            image: "https://example.com/series/breaking-bad.jpg",
        },
    ],
    follows: [
        {
            id: 1,
            follower: { id: 1, userName: "john_doe" },
            following: { id: 2, userName: "jane_smith" },
            state: "accepted",
            createdAt: new Date(),
        },
    ],
};
