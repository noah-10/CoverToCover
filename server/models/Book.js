const Schema = require("mongoose");

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
            required: true
        },
        firstSentence: {
            type: String
        },
        link: {
            type: String
        }
    }
);

module.exports = bookSchema;
