const { Schema, model } = require("mongoose");
const uniqeValidator = require('mongoose-unique-validator');
const bcrypt = require("bcrypt");

// define user schema
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            match: [/.+@.+\..+/, 'Must use a valid email address'], 
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [8, "Password must be at least 8 characters long"]
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

// Apple the unique validator to schema to be able to get error msg
userSchema.plugin(uniqeValidator, { message: `The {PATH} is already used`});

// create and export user model
const User = model("User", userSchema);

module.exports = User;