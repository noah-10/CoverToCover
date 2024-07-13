const { User, Book } = require('../models');

// sign token for auth
const { signToken, AuthenticationError } = require('../utils/auth');

const checkBooks = require('../utils/checkBooks');

const resolvers = {
    Query: {
        //For getting all info on user
        me: async (parent, args, context) => {
            if(context.user){
                return User.findOne({ _id: context.user._id})
                .populate('savedBooks')
                .populate('currentlyReading')
                .populate('finishedBooks')
                .populate('dislikedBooks')
            }else{
                return { message: "Error getting user" };
            };
        },

        // Get saved boks of user
        savedBooks: async (parent, args, context) => {
            if(context.user){
                return User.findOne({ _id: context.user._id})
                .populate('savedBooks')
                .select('savedBooks')
            }else{
                return { message: "Error getting books" }
            }
        },

        // get currently reading books from user
        currentlyReading: async (parent, args, context) => {
            if(context.user){
                return User.findOne({ _id: context.user._id})
                .populate('currentlyReading')
                .select('currentlyReading')
            }else{
                return { message: "Error getting books" }
            }
        },

        // get finished books from user
        finishedBooks: async (parent, args, context) => {
            if(context.user){
                return User.findOne({ _id: context.user._id})
                .populate('finishedBooks')
                .select('finishedBooks')
            }else{
                return { message: "Error getting books" }
            }
        },

        // get preferences from user
        myPreferences: async (parent, args, context) => {
            if(context.user){
                return User.findOne({ _id: context.user._id})
                .select('preferencedAuthor preferencedGenre')
            }else{
                return { message: "Error getting preferences" }
            }
        },

        allBooks: async(parent, args, context) => {
            if(context.user){
                return Book.find();
            }else{
                return { message: "Error getting books" };
            }
        },

        allUsers: async(parent, args, context) => {
            try{
                if(context.user){
                    const users = await User.find({ _id: { $ne : context.user._id }})
                    .populate('savedBooks')
                    .populate('currentlyReading')
                    .populate('finishedBooks');

                    return users;
                }else{
                    return { message: "Error getting all users"}
                }
            }catch(err){
                return { error: err };
            }
            
        },
    },

    Mutation: {
        // Logging a user in
        login: async (parent, { email, password }) => {
            const user = await User.findOne(
                { email: email }
            );

            if(!user){
                return { message: "No user found" }
            };

            const checkPassword = user.isCorrectPassword(password);

            if(!checkPassword){
                return { message: "Wrong email or password" }
            }

            const token = signToken(user);

            return { token, user };
        },

        // Adding user
        addUser: async (parent, { username, email, password, preferencedAuthor, preferencedGenre, currentlyReading, finishedBooks }) => {

            try{

                // Array of book Ids
                const saveCurrentBooks = [];
                const saveFinishedBooks = [];

                const checkBooksForDuplicates = async (bookId) => {
                    const bookChecked = await checkBooks(bookId);

                    return bookChecked;
                }

                // loop over each currently Reading book
                await Promise.all(currentlyReading.map(async (book) => {

                    // Pass each bookId to function to check
                    const checkBook = await checkBooksForDuplicates(book.bookId);

                    if(checkBook === false){
                        // If book isn't in database then create one
                        const newBook = await Book.create({
                            authors: book.authors,
                            title: book.title,
                            cover: book.cover,
                            bookId: book.bookId,
                            description: book.description,
                            categories: book.categories
    
                        });

                        // push new id to array
                        saveCurrentBooks.push(newBook._id);
                    }else {
                        // push already saved book to database
                        saveCurrentBooks.push(checkBook._id);
                    }

                    
                }));

                // loop over each finished book
                await Promise.all(finishedBooks.map(async (book) => {
                    // Pass each bookId to function to check
                    const checkBook = await checkBooksForDuplicates(book.bookId);

                    if(checkBook === false){
                        // If book isn't in database then create one
                        const newBook = await Book.create({
                            authors: book.authors,
                            title: book.title,
                            cover: book.cover,
                            bookId: book.bookId,
                            description: book.description,
                            categories: book.categories
    
                        });

                        // push new id to array
                        saveFinishedBooks.push(newBook._id);
                    }else {
                        // push already saved book to database
                        saveFinishedBooks.push(checkBook._id);
                    }
                }))


                // Create user
                const user = await User.create({
                    username,
                    email,
                    password,
                    preferencedAuthor,
                    preferencedGenre,
                    currentlyReading: saveCurrentBooks,
                    finishedBooks: saveFinishedBooks,
                });
    
                if(!user){
                    throw new Error("Error creating account");
                };

                const token = signToken(user);

                if(!token){
                    throw new Error("Error signing token");
                }
    
                return { token, user };
            }catch(err){

                // For unique
                if (err.code === 11000) {
                    throw new Error('Username or email already exists');
                }
                // For required
                else if(err.name === "ValidationError"){
                    const messages = Object.values(err.errors).map(e => e.message);
                    throw new Error(messages[0]);
                }
                throw new Error(err.message);
            }
        },

        // Saving a book to a user
        saveBook: async(parent, { input }, context) => {
            try{
                if(context.user){

                    //Check if book is in database
                    const bookChecked = await checkBooks(input.bookId);

                    // if it's not in database
                    if(bookChecked === false){
                        // save the book to database
                        const saveBook = await Book.create(
                            input
                        );

                        if(!saveBook){
                            return { message: 'Error adding book' };
                        };

                        // Pass in the new books id to the user document
                        const updatedUser = await User.findOneAndUpdate(
                            { _id: context.user._id },
                            { $push: { savedBooks: saveBook._id }},
                            { new: true }
                        );

                        if(!updatedUser){
                            return { message: "Error adding book to your collection"}
                        }

                        return saveBook;

                    } else{
                        // if the book is in database, then pass the id to the user
                        const updatedUser = await User.findOneAndUpdate(
                            { _id: context.user._id },
                            { $push: { savedBooks: bookChecked._id }},
                            { new: true }
                        );

                        if(!updatedUser){
                            return { message: "Error adding book to your collection"}
                        }

                        return bookChecked;
                    }                    
                }
            }catch(err){
                return { error: err };
            }
        },

        // For when a user swipes left on a book
        addDislikedBook: async (parent, { input }, context) => {
            console.log(input)
            try{
                if(context.user){

                    // Check if book is in database
                    const bookChecked = await checkBooks(input.bookId);

                    // if not create book for database
                    if(!bookChecked){
                        const newBook = await Book.create(input);

                        if(!newBook){
                            return { message: "Error adding book"}
                        };

                        // Update users disliked book to save the new book _id
                        await User.findOneAndUpdate(
                            { _id: context.user._id },
                            { $push: { dislikedBooks: newBook._id }},
                            { new: true }
                        );

                        return;
                    } else{

                        // Update the user if book is already in database
                        await User.findOneAndUpdate(
                            { _id: context.user._id },
                            { $push: { dislikedBooks: bookChecked._id }},
                            { new: true }
                        );

                        return;
                    }
                    
                }
            } catch(err){
                return { error: err };
            }
        },

        // From currently reading => finished
        finishedReading: async (parent, { bookId }, context) => {
            try{
                if(context.user){
                    //remove from currently reading
                    await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { currentlyReading: bookId }},
                        {new: true }
                    );
    
                    const addToFinished = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $push: { finishedBooks: bookId }},
                        { new: true }
                    );
    
                    if(!addToFinished){
                        return { message: "Error adding book" };
                    };
        
                    return { addToFinished };
                }
            }catch(err){
                return { error: err };
            }
            
        },

        // Add to users currently reading
        addToCurrentlyReading: async (parent, { bookId }, context) => {
            
            try{
                if (context.user) {
            
                    // Get books Object Id
                    const book = await Book.findOne({ bookId });
            
                    if (!book) {
                        console.error("Book not found");
                    }
            
                    // Add object Id to user's currently reading list
                    const addedToCurrentlyReading = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $push: { currentlyReading: book._id }},
                        { new: true }
                    );
            
                    if (!addedToCurrentlyReading) {
                        console.error("Error adding book to currently reading list");
                    }

                    // Remove object Id from user's saved books
                    const removeFromSaved = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { savedBooks: book._id }},
                        { new: true }
                    );

                    if(!removeFromSaved){
                        console.error("Error removing from saved books");
                    }
            
                    return { addedToCurrentlyReading };
                }
                throw AuthenticationError;
            
            }catch(error){
                console.error("Error adding to currently reading", error);
            }
            
        },

        // removing a book from a users saved Books
        removeSavedBook: async (parent, { bookId }, context) => {
            try{
                
                if(context.user){
                    const removeBook = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { savedBooks: { bookId: bookId } }},
                        { new: true }
                    );

                    if(!removeBook){
                        return { message: "Error removing book"};
                    };

                    return removeBook;
                }
                throw AuthenticationError;
            }catch(err){
                return { error: err }
            }
        },

        // removing a book from a users currently reading Books
        removeCurrentlyReadingBook: async (parent, { bookId }, context) => {
            try{
                if(context.user){
                    const removeBook = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { currentlyReading: { bookId: bookId } }},
                        { new: true }
                    );

                    if(!removeBook){
                        return { message: "Error removing book"};
                    };

                    return removeBook;
                }
            }catch(err){
                return { error: err };
            }
        },

        // removing a book from a users currently reading Books
        removeCurrentlyReadingBook: async (parent, { bookId }, context) => {
            try{
                if(context.user){
                    const removeBook = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { currentlyReading: { bookId: bookId } }},
                        { new: true }
                    );

                    if(!removeBook){
                        return { message: "Error removing book"};
                    };

                    return removeBook;
                }
            }catch(err){
                return { error: err };
            }
        },

        //Add to users author preference
        addPreferenceAuthor: async (parent, { authors }, context) => {
            if(context.user){
                const addAuthor = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { preferencedAuthor: { $each: authors }}},
                    { new: true }
                );

                if(!addAuthor){
                    return { message: "Error adding author"}
                };

                return addAuthor;
            };
            throw AuthenticationError;
        },

        //Add to users genre preference
        addPreferenceGenre: async (parent, { genre }, context) => {
            if(context.user){
                const addGenre = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { preferencedGenre: { $each: genre }}},
                    { new: true }
                );

                if(!addGenre){
                    return { message: "Error adding genre"}
                };

                return addGenre;
            };
            throw AuthenticationError;
        },

        updateUsername: async (parent, { username }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { username },
                    { new: true }
                );
                return updatedUser;
            }
            throw AuthenticationError;
        },

        updateEmail: async (parent, { email }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { email },
                    { new: true }
                );
                return updatedUser;
            }
            throw AuthenticationError;
        },

        updatePassword: async (parent, { password }, context) => {
            if (context.user) {
                const user = await User.findById(context.user._id);
    
                if (!user) {
                    throw new Error('User not found');
                }
    
                user.password = password;
                const updatedUser = await user.save();
    
                return updatedUser;
            }
            throw AuthenticationError;
        },

        removePreferenceAuthor: async (parent, { authorId }, context) => {
            if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
                context.user._id,
                { $pull: { preferencedAuthor: authorId } },
                { new: true }
            );
            return updatedUser;
            }
            throw AuthenticationError;
        },

        removePreferenceGenre: async (parent, { genreId }, context) => {
            if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
                context.user._id,
                { $pull: { preferencedGenre: genreId } },
                { new: true }
            );
            return updatedUser;
            }
            throw AuthenticationError;
        },    

        
    },
}

module.exports = resolvers;