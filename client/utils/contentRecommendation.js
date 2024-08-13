import { searchBookTitle } from "./API.js";
import { checkImgSize, scrapeBookCover } from "./bookCover.js";
import axios from "axios";


export const getContentRecommendations = async (genres, currentUser, feed, localStorage) => {
    //get weights
    let viewedBooks = [];
    let weights = {};
    weights = await createWeights(genres, weights);  

    // Array of all book titles the user has seen
    const currentUserBookTitles = userBookTitles(currentUser);

    const currentUserAuthors = currentUser.preferencedAuthor;

    // Array of all bookIds the user has seen
    const currentUserBookIds = userBookIds(currentUser);

    // array of the bookIds from the current feed
    const currentFeed = currentFeedIds(feed);

    // array of the bookIds from the local storage
    const localStorageBooks = localStorageIds(localStorage);

    // Make query to openai (Gives titles)
    let openAiBooks = await openAiQuery(weights, null, currentUserAuthors);

    // Filters books given by openai to not show duplicates
    let filterSuccess = null
    let filteredBooks = filterBookTitles(currentUserBookTitles, openAiBooks);

    filterSuccess = filteredBooks.success;
     
    while(filterSuccess === false){
        // Push seen books to array for prompt
        viewedBooks.push(...filteredBooks.viewedBooks);
        
        // Re query books from openAi
        openAiBooks = await openAiQuery(weights, viewedBooks);

        filteredBooks = filterBookTitles(currentUserBookTitles, openAiBooks);

        filterSuccess = filteredBooks.success
    };
    
    // For each book make query to google Books to get all info
    const bookData = await getBookInfo(filteredBooks.checkedBooks); 
    console.log(bookData);

    if(bookData.limitReached === true){
        return bookData;
    }

    // Double check books to not include any that have been seen/read and are in english
    const recommendBooks = await filterViewerPersonalization(bookData.allBookInfo, currentUserBookIds, currentFeed, localStorageBooks);

    let formattedBooks = await Promise.all(recommendBooks.map(formatBook).filter(book => book !== null));
    formattedBooks = formattedBooks.filter(book => book !== null);

    return formattedBooks;
}

const filterBookTitles = (userBooks, aiBooks) => {

    let success = false;
    // Only return books if user doesn't already have them saved or already disliked them
    const checkedBooks = aiBooks.filter((book) => {
        return !userBooks.includes(book);
    });

    if(checkedBooks.length < 10){
        // Return the books the user has seen so we can implement it into the prompt
        const viewedBooks = aiBooks.filter((book) => {
            return userBooks.includes(book);
        });

        return {viewedBooks, success};
    }else{
        success = true;
        return { checkedBooks, success };
    }
    
}

const getBookInfo = async(books) => {

    // const retryDelay = 10000; // 10 second delay for retries
    const maxRetries = 3; // Maximum number of retries;
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const allBookInfo = [];
    let limitReached = false;

    for (const book of books) {

        // let attempts = 0;
        let success = false;
        let bookData = null;

        while (!success){
            try{
                // delay between retries
                // if(attempts > 0) {
                //     await delay(retryDelay);
                // }

                const response = await searchBookTitle(book);

                if(response.status === 429){
                    console.log("Error code 429 - Too many requests");
                    // attempts++;
                    return { limitReached: true }; //Retry after delay
                }

                const data = await response.json();
                bookData = data.items[0];
                success = true;
            }catch(err){
                console.log(`${err}`);
            }
        }

        // if(!success){
        //     console.log("Failed to fetch books")
        //     await delay(2000);
        //     return;
        // }

        // if(!bookData){
        //     await delay(2000);
        //     return;
        // }else{
        allBookInfo.push(bookData);
        await delay(1000);
        // }
 
    };

    // if(success){
    return { allBookInfo, limitReached }
    // }else{
    //     return { limitReached: true };
    // }
}

const openAiQuery = async (genreWeight, viewedBooks, authors) => {
    console.log(authors);
    console.log(viewedBooks);
    // Create prompt
    let prompt = "Given this list of book genres and a score (higher the score, the more I like it): \n\n"; 
    Object.entries(genreWeight).forEach(([genre, score]) => {
        prompt += `- ${genre}: ${score} \n`;
    });
    if(authors){
        prompt += `\n Also this list of authors I like: \n`;
        authors.forEach((author) => {
            prompt += `\- ${author}\n`;
        })
    }
    if(viewedBooks){
        prompt += `\nI have already seen these books so do not include them: \n\n`
        viewedBooks.forEach((book) => {
            prompt += `- ${book}\n`;
        });
    }
    prompt += "\nGive me 20 book recommendations, include only the title, and it shouldn't be numbered. It should be in JSON format, this is what I expect: { \n\"titles\": [\n \"Atomic Habits\", \n \"Harry Potter\" \n] \n}";
    try{
        console.log(prompt);
        const url = "http://localhost:3001/api/content"

        let { data } = await axios.get(url, {
            params: { prompt }
        })

        console.log(data)

        const response = JSON.parse(data.choices[0].text.trim());
        console.log(response);
        let recommendations = response.titles;

        return recommendations;
            
    }catch (err){
        console.error("Error getting recommendation", err);
    }
}

const userBookTitles = (currentUser) => {
    const bookIds = [
        ...(currentUser.savedBooks || []).flatMap(book => book.title || []),
        ...(currentUser.currentlyReading || []).flatMap(book => book.title || []),
        ...(currentUser.finishedBooks || []).flatMap(book => book.title || []),
        ...(currentUser.dislikedBooks || []).flatMap(book => book.title || []),
    ];

    return bookIds;
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

const currentFeedIds = (feedBooks) => {
    const bookIds = [
        ...(feedBooks || []).flatMap(book => book.bookId || []),
    ];

    return bookIds;
}

const localStorageIds = (localStorageBooks) => {
    const bookIds = [
        ...(localStorageBooks || []).flatMap(book => book.bookId || []),
    ];

    return bookIds;
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

// Checks if book has already been seen by user
const filterViewerPersonalization = (allBooks, bookIds, currentFeed, localStorageBooks) => {

    const checkLanguage = allBooks.filter((book) => {
        if(book.volumeInfo.language === "en"){
            return book;
        }
    })

    // Checks for duplicates for current feed
    const checkedFeedIds = checkLanguage.filter((book) => {
        return !currentFeed.includes(book.id)
    })

    // Only return books if user doesn't already have them saved or already disliked them
    const checkedFeedBookIds = checkedFeedIds.filter((book) => {
        return !bookIds.includes(book.id);
    })

    // Only return books if user doesn't already have them saved or already disliked them
    const checkedlocalStorageIds = checkedFeedBookIds.filter((book) => {
        return !localStorageBooks.includes(book.id);
    })

   return checkedlocalStorageIds;
}

const formatBook = async(book) => {
    if (!book || !book.volumeInfo || !book.volumeInfo.description || !book.volumeInfo.imageLinks || !book.volumeInfo.imageLinks.thumbnail ) return null;
    let bookCover = book.volumeInfo.imageLinks.thumbnail;
    bookCover = bookCover.replace('zoom=1', 'zoom=4');

    // checks book size after changing the zoom // makes sure the img is still compatible
    const checkedImgSize = await checkImgSize(bookCover, book.volumeInfo.title, book.volumeInfo.authors[0]);
    if(book){
        return {
            authors: book.volumeInfo.authors,
            title: book.volumeInfo.title,
            cover: checkedImgSize,
            bookId: book.id,
            description: book.volumeInfo.description,
            categories: book.volumeInfo.categories,

        }
    }
}


