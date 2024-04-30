const { User } = require('../models');

// sign token for auth
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        //For getting all info on user
        me: async (parent, args, context) => {
            if(context.user){
                return User.findOne({ _id: context.user._id})
                .populate('savedBooks')
                .populate('currentlyReading')
                .populate('finishedBooks')
                .populate('preferences')
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
                .populate('preferences')
                .select('preferences')
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
            try{
                if(context.user){
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
            }catch(err){
                return { error: err}
            }
        },

        addToFinished: async (parent, { input }, context) => {
            try{
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
            }catch(err){
                return { error: err };
            }
        },

        // Add to users currently reading
        addToCurrentlyReading: async (parent, { input }, context) => {
            try{
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
            }catch(err){
                return { error: err };
            }
        },

        // removing a book from a users saved Books
        removeBook: async (parent, { bookId }, context) => {
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
            }catch(err){
                return { error: err };
            }
        },

        //Add to users author preference
        addPreferenceAuthor: async (parent, { authors }, context) => {
            try {
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
            }catch(err){
                return { error: err };
            }
        },

        //Add to users genre preference
        addPreferenceGenre: async (parent, { genre }, context) => {
            try {
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
            }catch(err){
                return { error: err };
            }
        }
    }
}

module.exports = resolvers;