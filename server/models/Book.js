const { Schema, model } = require("mongoose");

// define book schema
const bookSchema = new Schema(
    {
        authors: [
            {
                type: String
            }
        ],
        title: {
            type: String,
            required: true
        },
        cover: {
            type: String
        },
        bookId: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String
        },
        categories: [String],
        link: {
            type: String
        }
    }
);

const Book = model("Book", bookSchema)

// export schema
module.exports = Book;
