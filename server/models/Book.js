const { Schema } = require("mongoose");

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
            // this seems not to do anything since bookSchema is only used for subdocuments
            unique: true
        },
        firstSentence: {
            type: String
        },
        link: {
            type: String
        }
    }
);

// export schema
module.exports = bookSchema;
