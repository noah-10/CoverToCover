import { searchBookTitle } from "./API.js";
import OpenAI from 'openai';

export const getContentRecommendations = async (genres, currentUser, feed) => {

    //get weights
    let viewedBooks = [];
    let weights = {};
    weights = await createWeights(genres, weights);  
    console.log(feed)
    // Array of all book titles the user has seen
    const currentUserBookTitles = userBookTitles(currentUser);

    // Array of all bookIds the user has seen
    const currentUserBookIds = userBookIds(currentUser);

    // array of the bookIds from the current feed
    const currentFeed = currentFeedIds(feed);

    // Make query to openai (Gives titles)
    let openAiBooks = await openAiQuery(weights);

    // Filters books given by openai to not show duplicates
    let filterSuccess = null
    let filteredBooks = filterBookTitles(currentUserBookTitles, openAiBooks);

    filterSuccess = filteredBooks.success;
     
    while(filterSuccess === false){
        // Push seen books to array for prompt
        viewedBooks.push(...filteredBooks.viewedBooks);
        console.log(viewedBooks);
        
        // Re query books from openAi
        openAiBooks = await openAiQuery(weights, viewedBooks);

        filteredBooks = filterBookTitles(currentUserBookTitles, openAiBooks);

        filterSuccess = filteredBooks.success
    };
    
    // For each book make query to google Books to get all info
    const bookData = await getBookInfo(filteredBooks.checkedBooks); 

    // Double check books to not include any that have been seen/read and are in english
    const recommendBooks = await filterViewerPersonalization(bookData, currentUserBookIds, currentFeed)

    const formattedBooks = await Promise.all(recommendBooks.map(async (book) => {
        return formatBook(book);
    }))

    return formattedBooks;
}

const filterBookTitles = (userBooks, aiBooks) => {

    let success = false;
    console.log(aiBooks);
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

    const retryDelay = 10000; // 5 second delay for retries
    const maxRetries = 3; // Maximum number of retries;

    const allBookInfo = await Promise.all(books.map(async (book) => {

        let attempts = 0;
        let success = false;
        let bookData = null;

        while (attempts < maxRetries && !success){
            try{
                // delay between retries
                if(attempts > 0) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                }

                const response = await searchBookTitle(book);

                if(response.status === 429){
                    console.log("Error code 429 - Too many requests");
                    attempts++;
                    continue; //Retry after delay
                }

                const data = await response.json();
                bookData = data.items[0];
                success = true;
            }catch(err){
                console.log(`${err}`);
                attempts++;
            }
        }

        if(!success){
            console.log("Failed to fetch books")
            return;
        }
        return bookData;
    }));

    return allBookInfo
}

const openAiQuery = async (genreWeight, viewedBooks) => {
    // Create prompt
    let prompt = "Given this list of book genres and a score (higher the score, the more I like it): \n\n"; 
    Object.entries(genreWeight).forEach(([genre, score]) => {
        prompt += `- ${genre}: ${score} \n`;
    });
    if(viewedBooks){
        prompt += `\nI have already seen these books so do not include them: \n\n`
        viewedBooks.forEach((book) => {
            prompt += `- ${book}\n`;
        });
    }
    prompt += "\nGive me 20 book recommendations in JSON format with only titles in an array Example: \"titles\": [\"Atomic Habits\", \"Harry Potter\"]";
    console.log("prompt", prompt)
    try{
        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            prompt: prompt,
            max_tokens: 2000,
        });

        console.log(response)

        // const cleanResponse = response.replace(/,\s*]/, ']');
        // console.log("cleanResponse", cleanResponse)
        const data = JSON.parse(response.choices[0].text.trim());
        let recommendations = data.titles;

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
const filterViewerPersonalization = (allBooks, bookIds, currentFeed) => {

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
    const checkedBookIds = checkedFeedIds.filter((book) => {
        return !bookIds.includes(book.id);
    })

   return checkedBookIds;
}

const formatBook = (book) => {
    const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'client/src/assets/coverPlaceholder.svg';
    if(!book.volumeInfo.description)return;
    return {
        authors: book.volumeInfo.authors,
        title: book.volumeInfo.title,
        cover: thumbnail,
        bookId: book.id,
        description: book.volumeInfo.description,
        categories: book.volumeInfo.categories,

    }
}


