import { searchBookTitle } from "./API.js";
import OpenAI from 'openai';

export const getContentRecommendations = async (genres, currentUser) => {

    //get weights
    let weights = {};
    weights = await createWeights(genres, weights);  

    // Get all of the books the user has seen/read
    const currentUserBooks = userBookIds(currentUser) 

    // Make query to openai
    const openAiBooks = await openAiQuery(weights);
    
    // For each book make query to google Books to get all info
    const bookData = await getBookInfo(openAiBooks) 
    console.log(bookData)

    // Filter books to not include any that have been seen/read
    const filteredBooks = await filterViewerPersonalization(bookData, currentUserBooks)

    return filteredBooks;
}

const getBookInfo = async(books) => {
    const allBookInfo = await Promise.all(books.map(async (book) => {
        const response = await searchBookTitle(book);
        const data = await response.json();
        const bookData = data.items[0];
        return formatBook(bookData);
    }))

    return allBookInfo
}

const openAiQuery = async (genreWeight) => {
    // Create prompt
    let prompt = "Given this list of book genres and a score (higher the score, the more I like it): \n\n"; 
    Object.entries(genreWeight).forEach(([genre, score]) => {
        prompt += `- ${genre}: ${score} \n`;
    });
    prompt += "\nGive me 20 book recommendations in JSON format with only titles in an array Example: \"titles\": [\"Atomic Habits\", \"Harry Potter\"]"; 

    try{
        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            prompt: prompt,
            max_tokens: 250,
        });

        console.log("response", response);

        const data = JSON.parse(response.choices[0].text.trim());

        let recommendations = data.titles;
        recommendations = recommendations.map((title) => title.split(" ").join("+"));

        console.log(recommendations)
        return recommendations;
    
    }catch (err){
        console.error("Error getting recommendation", err);
    }
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
const filterViewerPersonalization = (allBooks, bookIds) => {

    // Only return books if user doesn't already have them saved or already disliked them
    const checkedBookIds = allBooks.filter((book) => {
        return !bookIds.includes(book.bookId);
    })

   return checkedBookIds;
}

const formatBook = (book) => {
    const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'client/src/assets/coverPlaceholder.svg';
    return {
        authors: book.volumeInfo.authors,
        title: book.volumeInfo.title,
        cover: thumbnail,
        bookId: book.id,
        description: book.volumeInfo.description,
        categories: book.volumeInfo.categories,

    }
}


