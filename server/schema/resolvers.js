const { User } = require('../models');

// sign token for auth
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        //For getting all info on user
        me: async (parent, args, context) => {
            if(context.user){
                return User.findOne({ _id: context.user._id})
                .populate('savedBooks')
                .populate('currentlyReading')
                .populate('finishedBooks')
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
        }
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
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({
                username,
                email,
                password
            });

            if(!user){
                return { message: "Error creating account" };
            };

            const token = signToken(user);

            return { token, user };
        },

        // Saving a book to a user
        saveBook: async(parent, { input }, context) => {
            if(context.user){
                // get user data to check if the book to save is a duplicate
                const userData = await User.findOne({ _id: context.user._id }).populate("savedBooks");

                if (!userData) {
                    return { message: "Error fetching user data" };
                }

                // if the book is already in the saved books, return
                if (userData.savedBooks.reduce((acc, cur) => (acc || cur.bookId === input.bookId), false)) {
                    return { message: "Book already saved" };
                }

                // otherwise save the book
                const saveBook = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input }},
                    { new: true },
                );

                if(!saveBook){
                    return { message: "Error adding book" };
                };  

                return saveBook;
            }
            throw AuthenticationError;
        },

        addToFinished: async (parent, { input }, context) => {
            if(context.user){
                const finishedBook = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { finishedBooks: input }},
                    {new: true }
                );

                if(!finishedBook){
                    return { message: "Error adding book" };
                };

                return finishedBook;
            }
            throw AuthenticationError;
        },

        // Add to users currently reading
        addToCurrentlyReading: async (parent, { input }, context) => {
            if(context.user){
                const currentlyReading = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { currentlyReading: input }},
                    { new: true }
                );

                if(!currentlyReading){
                    return { message: "Error adding book" };
                };

                return currentlyReading;
            }
            throw AuthenticationError;
        },

        // removing a book from a users saved Books
        removeBook: async (parent, { bookId }, context) => {
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