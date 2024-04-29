const fs  = require('fs');
const csv = require('csv-parser');

// Create mock user
const mockUser = {
    userId: '1',
    genre: [ "Fantasy", "Romance", "Action", "Adventure"],
}

// Create weights
const genreWeights = {
    'Fantasy': 10,
    'Romance': 7,
    "Action": 2,
    "Adventure": 5
}

// Function to filter books based on user's preferred genres
// Only needs one genre to match users preferred genre
const filterViewerPersonalization = (genre, allBooks) => {
    return allBooks.filter((book) => genre.some((g) => book.genre.includes(g)));
}

// Function to read book data from CSV file
const readBooksFromCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const books = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Check if 'genre' property exists and is a string
                if (row._8 && typeof row._8 === 'string') {
                    // Remove leading and trailing quotes and split by comma
                    row.genre = row._8.slice(1, -1).split("', '").map((g) => g.trim());
                } else {
                    // If 'genre' is undefined or not a string, set it to an empty array
                    row.genre = [];
                }
                // Remove the original property '_8' from the row
                delete row._8;
                books.push(row);
            })
            .on('end', () => {
                resolve(books);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Calculate weights
const calculateScore = (book) => {
    let score = 0;
    book.genre.forEach((genre) => {
        if(genreWeights[genre]){
            score += genreWeights[genre];
        }
    })

    return score;
}


const topBooks = (books) => {
    // Adds a score for each book
    books.forEach((book) => {
        book.score = calculateScore(book);
    });

    // Sorts the books
    books.sort((a, b) => b.score - a.score);

    // Only give 10
    const top10Books = books.slice(0,10);
    return top10Books;
}

// Initialize function
const init = async () => {
    try {
        // Read book data from CSV file
        const allBooks = await readBooksFromCSV('./books_1.Best_Books_Ever.csv');
        
        // Filter books based on user's preferred genres
        const filteredBooks = filterViewerPersonalization(mockUser.genre, allBooks);

        //Calculate score for each filtered book
        const recommend = topBooks(filteredBooks);

        recommend.forEach((book) => {
            const selectedFields = {
                'title': book['_1'],
                'author': book['_3'],
                'rating': book['_4'],
                'description': book['_5'],
                'language': book['_6'],
                'ISBN': book['_7'],
                'coverImg': book['_21'],
                'genre': book['genre'],
                'score': book['score']
            }
            console.log(selectedFields)
        })
        
        // Print filtered books
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the init function
init();

// R1 = title
// R3 = author
// R4 = Rating
// R5 = Description
// R6 = Language
// R7 = ISBN
// R21 = Cover img
// Genre