const Schema = require("mongoose");

const preferenceSchema = new Schema(
    {
        authors: [
            {
                type: String
            }
        ],
        subjects: [
            {
                type: String
            }
        ],
        books: [
            {
                type: String
            }
        ]
    }
);

module.exports = preferenceSchema;
