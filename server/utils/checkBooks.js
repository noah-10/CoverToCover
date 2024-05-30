const { Book } = require('../models')

module.exports = checkBooks = async(bookId) => {

    const bookData = await Book.findOne(
        { bookId: bookId}
    );

    if(bookData){
        return bookData;
    }else{
        return false
    }
}

