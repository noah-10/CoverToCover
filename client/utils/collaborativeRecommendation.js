
export const getCollaborativeRecommendation = async(genres, allUsers, currentUser, feed, localStorage) => {
    //get weights
    let currentUserWeights = {};
    currentUserWeights = await createWeights(genres, currentUserWeights);

   
    // Contains the most similar user and other similiar users
    const similarUser = await findSimilarity(allUsers, currentUserWeights);
    
    if(similarUser.mostSimilarUser){
        
        const recommendation = await getRecommendationFromUser(similarUser.mostSimilarUser, currentUser, feed, localStorage);
        const recommendBooks = recommendation.map((book) => {
            const { __typename, ...formatBook } = book;
            return formatBook
        })


        // if not enough books to recommend then it gets books from all similar users
        if(recommendBooks.length < 10){
            let moreRecommendations = [];

            let allRecommendations = await Promise.all(similarUser.similarUsers.map(async(user) => {
                const allSimilarUserBooks = getRecommendationFromUser(user, currentUser, feed);
                
                return allSimilarUserBooks;
            }))
            allRecommendations = allRecommendations.flat()

            const uniqueBooks = new Set();
            const uniqueRecommendation = [];

            allRecommendations.forEach((book) => {
                if(!uniqueBooks.has(book.bookId)){
                    uniqueBooks.add(book.bookId);
                    uniqueRecommendation.push(book)
                }
            })
            return uniqueRecommendation;
        }
        return recommendBooks;
    }

    return;
}

const getRecommendationFromUser = (mostSimilarUser, currentUser, feed, localStorage) => {

    //  Get books from the most similar user
    const similarUserBooks = [
        ...mostSimilarUser.savedBooks || [],
        ...mostSimilarUser.currentlyReading || [],
        ...mostSimilarUser.finishedBooks || [],
    ];

    const currentUserBookIds = [
        ...(currentUser.savedBooks || []).flatMap(book => book.bookId || []),
        ...(currentUser.currentlyReading || []).flatMap(book => book.bookId || []),
        ...(currentUser.finishedBooks || []).flatMap(book => book.bookId || []),
        ...(currentUser.dislikedBooks || []).flatMap(book => book.bookId || []),
    ];

    const feedBookIds = [
        ...(feed || []).flatMap(book => book.bookId || []),
    ];

    const localStorageIds = [
        ...(localStorage || []).flatMap(book => book.bookId || []),
    ];

    // no duplicates for current user compared to similar user
    const similarToCurrentCheck = similarUserBooks.filter((book) => {
        return !currentUserBookIds.includes(book.bookId)
    })

    // no duplicates with the feed
    const feedCheck = similarToCurrentCheck.filter((book) => {
        return !feedBookIds.includes(book.bookId)
    })

    // no duplicates with the local storage
    const recommend = feedCheck.filter((book) => {
        return !localStorageIds.includes(book.bookId)
    })

    // return similar user books that havn't been seen
    return recommend;
}


const findSimilarity = async(allUsers, currentUserVector) => {

    // Find the most similar user
    let mostSimilarUser = null;
    let maxSimilarity = 0.3;

    // Find similar users
    let similarUsers = [];
    const minSimilarity = 0.3
    
 
    const similarities = await Promise.all(allUsers.map(async (user) => {
        const otherUserPreferences = await getPreferences(user);
        let otherUserWeights = {};
        const userWeights = await createWeights(otherUserPreferences, otherUserWeights);

        const similarity = cosineSimilarity(currentUserVector, userWeights);
        return { user, similarity };
    }));

    similarities.forEach(({ user, similarity }) => {
        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            mostSimilarUser = user;
        }

        if(similarity > minSimilarity){
            similarUsers.push(user);
        }
    });

    return { mostSimilarUser, similarUsers };
}

const cosineSimilarity = (vectorA, vectorB) => {
    let dotProduct = 0;

    //  magnitudes
    let normA = 0
    let normB = 0

    const allKeys = new Set([...Object.keys(vectorA), ...Object.keys(vectorB)]);

    allKeys.forEach(key => {
        const valueA = vectorA[key] || 0;
        const valueB = vectorB[key] || 0;

        dotProduct += valueA * valueB;
        normA += valueA * valueA;
        normB += valueB * valueB;
    });

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

const getPreferences = async (user) => {
    let sortedPreferences = [];
    let sortedDislikes = [];
    if(user){
        sortedPreferences = sortedPreferences.concat(
            // user.preferencedAuthor.map(preference => ({ queryType: "author", query: preference })),
            user.savedBooks ? user.savedBooks.flatMap(book => book.categories.map(category => (category))) : [],
            user.currentlyReading ? user.currentlyReading.flatMap(book => book.categories.map(category => (category))) : [],
            user.finishedBooks ? user.finishedBooks.flatMap(book => book.categories.map(category => (category))): [],
            user.preferencedGenre ? user.preferencedGenre.map(preference => (preference)): []
        );

        sortedDislikes = user.dislikedBooks ? user.dislikedBooks.flatMap(book => book.categories.map(category => (category))): []
    }


    return { sortedPreferences, sortedDislikes };
}

// // make a weight based on genres (More of the same add on for a bigger score)
const createWeights = (genres, weights) => {
    if(genres.sortedPreferences){
        genres.sortedPreferences.forEach((genre) => {
            if(genre in weights){
                let item = weights[`${genre}`];
                weights[`${genre}`] = ++item;
            }else{
                weights[`${genre}`] = 1;
            }
        });
    }
    
    if(genres.sortedDislikes){
        genres.sortedDislikes.forEach((genre) => {
            if(genre in weights){
                let item = weights[`${genre}`];
                weights[`${genre}`] = --item;
            }else{
                weights[`${genre}`] = -1;
            }
        })
    }
    

    return weights;
}



















// const getRecommendations = (users, bookIds) => {

//     // get all of other users saved/currently reading/finished books
//     let allRecommendBooks = [];

//     users.map((user) => {
//         const otherUserBooks = [
//             ...(user.savedBooks || []).flatMap(book => book || []),
//             ...(user.currentlyReading || []).flatMap(book => book || []),
//             ...(user.finishedBooks || []).flatMap(book => book || []),
//         ]

//         allRecommendBooks = allRecommendBooks.concat(otherUserBooks)
//     })

//     // Only returns books that the current user doesn't have saved already
//     allRecommendBooks = allRecommendBooks.filter((book) => {
//         return !bookIds.includes(book.bookId);
//     })

//     return allRecommendBooks
// }

// const userBookIds = (currentUser) => {
//     const bookIds = [
//         ...(currentUser.savedBooks || []).flatMap(book => book.bookId || []),
//         ...(currentUser.currentlyReading || []).flatMap(book => book.bookId || []),
//         ...(currentUser.finishedBooks || []).flatMap(book => book.bookId || []),
//         ...(currentUser.dislikedBooks || []).flatMap(book => book.bookId || []),
//     ];

//     return bookIds;
// }

// // rank the filtered users based on the weights
// const rankUsers = (users, weights) => {

//     const usersWithScores = users.map(user => {
//         //Get each users preferenced from all books and prefered genres
//             const userPreference = [
//                 ...(user.savedBooks || []).flatMap(book => book.categories || []),
//                 ...(user.currentlyReading || []).flatMap(book => book.categories || []),
//                 ...(user.finishedBooks || []).flatMap(book => book.categories || []),
//                 ...(user.preferencedGenre || []),
//             ];

//             const userScore = calculateScore(userPreference, weights)

//             return {
//                 ...user,
//                 score: userScore
//             }
//     })

//     const sortedUsers = usersWithScores.sort((a, b) => b.score - a.score);

//     //Returns the top 10 users that are most common with the current user
//     const top10Users = sortedUsers.slice(0,10);

//     return top10Users;
// }

// const calculateScore = (preferences, weights) => {
//     let score = 0;

//     preferences.forEach((preference) => {
//         if(weights[preference]){
//             score += weights[preference]
//         }
//     })

//     return score
// }



// // Filter users and only return the ones that have atleast one common genre
// const filterUsers = (genre, users) => {

//     return users.filter((user) => {
//         return Array.isArray(user.preferencedGenre) &&
//         genre.some((g) => user.preferencedGenre.includes(g));
//     })
// }