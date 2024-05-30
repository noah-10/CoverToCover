const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// define user schema
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            match: [/.+@.+\..+/, 'Must use a valid email address'] 
        },
        password: {
            type: String,
            required: true
        },
        preferencedAuthor: [String],
        preferencedGenre: [String],
        savedBooks: [
            {
                type: Schema.Types.ObjectId, 
                ref: 'Book',
            },
        ],
        currentlyReading: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Book',
            },
        ],
        finishedBooks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Book',
            },
        ],
        dislikedBooks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Book',
            },
        ],
    }
);

// salt and hash the password
userSchema.pre("save", async function(next) {
    if (this.isNew || this.isModified("password")) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

// check a password against the saved password
userSchema.methods.isCorrectPassword = async function(password) {
    return bcrypt.compare(password, this.password);
}

// create and export user model
const User = model("User", userSchema);

module.exports = User;