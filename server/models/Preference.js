const { Schema } = require("mongoose");

// define preference schema
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

// export schema
module.exports = preferenceSchema;
