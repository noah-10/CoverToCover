const { Schema, model } = require("mongoose");
let bcrypt = require("bcrypt");

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
        savedBooks: [bookSchema],
        currentlyReading: [bookSchema],
        finishedBooks: [bookSchema],
        preferences: preferenceSchema
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

const User = model("User", userSchema);

module.exports = User;