export const reviewMockData = {
    upvotes: [
        {
            id: 1,
            user: {
                id: 1,
                userName: "john_doe",
                avatar: "https://example.com/avatars/john.jpg",
            },
            createdAt: new Date(),
        },
        {
            id: 2,
            user: {
                id: 2,
                userName: "jane_smith",
                avatar: "https://example.com/avatars/jane.jpg",
            },
            createdAt: new Date(),
        },
    ],
    downvotes: [
        {
            id: 3,
            user: {
                id: 3,
                userName: "bob_jones",
                avatar: "https://example.com/avatars/bob.jpg",
            },
            createdAt: new Date(),
        },
    ],
    votesResponse: {
        items: [
            {
                id: 1,
                user: {
                    id: 1,
                    userName: "john_doe",
                    avatar: "https://example.com/avatars/john.jpg",
                },
                createdAt: new Date(),
            },
        ],
        total: 1,
        page: 1,
        perPage: 10,
    },
};
