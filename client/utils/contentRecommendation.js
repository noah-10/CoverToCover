import { searchBookTitle } from "./API.js";
import { checkImg } from "./bookCover.js";
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
    if(openAiBooks.ErrorGettingRecommendations === true){
        return { "error" : true }
    }

    // Filters books given by openai to not show duplicates
    let filterSuccess = null
    let filteredBooks = filterBookTitles(currentUserBookTitles, openAiBooks);

    filterSuccess = filteredBooks.success;
     
    while(filterSuccess === false){
        // Push seen books to array for prompt
        viewedBooks.push(...filteredBooks.viewedBooks);
        
        // Re query books from openAi
        openAiBooks = await openAiQuery(weights, viewedBooks);
        if(openAiBooks.ErrorGettingRecommendations === true){
            return { "error" : true }
        }

        filteredBooks = filterBookTitles(currentUserBookTitles, openAiBooks);

        filterSuccess = filteredBooks.success
    };
    
    // For each book make query to google Books to get all info
    const bookData = await getBookInfo(filteredBooks.checkedBooks); 

    if(bookData.limitReached === true){
        return bookData;
    }

    // Double check books to not include any that have been seen/read and are in english
    const recommendBooks = await filterViewerPersonalization(bookData.allBookInfo, currentUserBookIds, currentFeed, localStorageBooks);

    let formattedBooks = [];
    for (const book of recommendBooks) {
        const formattedBook = await formatBook(book);
        if (formattedBook !== null) {
            formattedBooks.push(formattedBook);
        }
    }
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
                const response = await searchBookTitle(book);

                if(response.status === 429){
                    // Limit has been reached for user
                    return { limitReached: true }; 
                }

                const data = await response.json();
                bookData = data.items[0];
                success = true;
            }catch(err){
                console.log(`${err}`);
            }
        }

        allBookInfo.push(bookData);
        await delay(1000);
 
    };

    return { allBookInfo, limitReached }
}

const openAiQuery = async (genreWeight, viewedBooks, authors) => {

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

    let attempts = 0;
    let success = false;
    const maxRetries = 5;
    const retryDelay = 2000;
    let recommendations = [];

    // While loop for incase it returns an unsuccessful syntax 
    while (attempts < maxRetries && !success){
        try{
            let baseUrl = 'http://localhost:3001';
            if(process.env.NODE_ENV === "production"){
                baseUrl = 'https://coverstocovers.com';
            }
            const url = `${baseUrl}/api/content`
    
            let { data } = await axios.get(url, {
                params: { prompt }
            })
        
            const response = JSON.parse(data.choices[0].text.trim());
            recommendations = response.titles;
            success = true;
                
        }catch (err){
            attempts++;

            if (attempts < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
                return { "ErrorGettingRecommendations": true };
            }
        }
    }

    return recommendations;
    
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
    bookCover = await checkImg(bookCover, book.volumeInfo.title, book.volumeInfo.authors[0]);
    
    if(book){
        return {
            authors: book.volumeInfo.authors,
            title: book.volumeInfo.title,
            cover: bookCover,
            bookId: book.id,
            description: book.volumeInfo.description,
            categories: book.volumeInfo.categories,

        }
    }
}


