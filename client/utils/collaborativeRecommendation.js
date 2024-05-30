
export const getCollaborativeRecommendation = async(genres, allUsers, currentUser) => {
    //get weights
    let weights = {};
    weights = await createWeights(genres, weights);

    // Get current users Books ids (prevent duplicates showing)
    const currentUserBooks = userBookIds(currentUser);

    // filter all users to have atleast one common genre
    const filteredUsers = await filterUsers(genres.sortedPreferences, allUsers);

    // Rank other users using weights
    const rankedUsers = rankUsers(filteredUsers, weights);

    // Get books from the most similar liking
    const recommend = getRecommendations(rankedUsers, currentUserBooks);
    return recommend;
}

const getRecommendations = (users, bookIds) => {

    // get all of other users saved/currently reading/finished books
    let allRecommendBooks = [];

    users.map((user) => {
        const otherUserBooks = [
            ...(user.savedBooks || []).flatMap(book => book || []),
            ...(user.currentlyReading || []).flatMap(book => book || []),
            ...(user.finishedBooks || []).flatMap(book => book || []),
        ]

        allRecommendBooks = allRecommendBooks.concat(otherUserBooks)
    })

    // Only returns books that the current user doesn't have saved already
    allRecommendBooks = allRecommendBooks.filter((book) => {
        return !bookIds.includes(book.bookId);
    })

    return allRecommendBooks
}

const userBookIds = (currentUser) => {
    const bookIds = [
        ...(currentUser.savedBooks || []).flatMap(book => book.bookId || []),
        ...(currentUser.currentlyReading || []).flatMap(book => book.bookId || []),
        ...(currentUser.finishedBooks || []).flatMap(book => book.bookId || []),
        ...(currentUser.dislikedBooks || []).flatMap(book => book.bookId || []),
    ];

    return bookIds;
}

// rank the filtered users based on the weights
const rankUsers = (users, weights) => {

    const usersWithScores = users.map(user => {
        //Get each users preferenced from all books and prefered genres
            const userPreference = [
                ...(user.savedBooks || []).flatMap(book => book.categories || []),
                ...(user.currentlyReading || []).flatMap(book => book.categories || []),
                ...(user.finishedBooks || []).flatMap(book => book.categories || []),
                ...(user.preferencedGenre || []),
            ];

            const userScore = calculateScore(userPreference, weights)

            return {
                ...user,
                score: userScore
            }
    })

    const sortedUsers = usersWithScores.sort((a, b) => b.score - a.score);

    //Returns the top 10 users that are most common with the current user
    const top10Users = sortedUsers.slice(0,10);

    return top10Users;
}

const calculateScore = (preferences, weights) => {
    let score = 0;

    preferences.forEach((preference) => {
        if(weights[preference]){
            score += weights[preference]
        }
    })

    return score
}

// make a weight based on genres (More of the same add on for a bigger score)
const createWeights = (genres, weights) => {
    genres.sortedPreferences.forEach((genre) => {
        if(genre in weights){
            let item = weights[`${genre}`];
            weights[`${genre}`] = ++item;
        }else{
            weights[`${genre}`] = 1;
        }
    });

    genres.sortedDislikes.forEach((genre) => {
        if(genre in weights){
            let item = weights[`${genre}`];
            weights[`${genre}`] = --item;
        }else{
            weights[`${genre}`] = -1;
        }
    })

    return weights;
}

// Filter users and only return the ones that have atleast one common genre
const filterUsers = (genre, users) => {

    return users.filter((user) => {
        return Array.isArray(user.preferencedGenre) &&
        genre.some((g) => user.preferencedGenre.includes(g));
    })
}