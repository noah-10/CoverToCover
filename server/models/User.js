const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// import schemas
const bookSchema = require("./Book");

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
        preferencedAuthor: [
            {
                type: String
            }
        ],
        preferencedGenre: [
            {
                type: String
            }
        ],
        savedBooks: [bookSchema],
        currentlyReading: [bookSchema],
        finishedBooks: [bookSchema],
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