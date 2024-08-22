import axios from 'axios';

const scrapeBookCover = async (title, author) => {

    let query = "";

    if(title.length > 12){
        query = title.split(" ").join("+")
    }else{
        const joined = title.concat(' by ', author);
        query = joined.split(" ").join("+");
    }

    const url = `http://localhost:3001/api/search`;
    let { data } = await axios.get(url, {
        params: { query }
    });

    let bookCover = null;

    if(data.timoutExceeded === true){
        query = title.split(" ").join("+");
        const { data } = await axios.get(url, {
            params: { query }
        });

        bookCover = data;

        if(data.timeoutExceeded === true){
            return bookCover = { "imageFound" : false };
        }
    }else{
        bookCover = { data, "imageFound": true };
    }

    if(bookCover.imageFound && bookCover.imageFound === false){
        return { "imageFound": false }
    }
    
    bookCover = bookCover.data.allImgs.filter(url => url !== null);

    let newImg = bookCover[0];

    // Resize images to increase quality
    if(newImg.imageSrc.includes('_SX50_')){
        newImg = newImg.imageSrc.replace('_SX50_', '_SX400_');
    }else if(newImg.imageSrc.includes('_SX100_')){
        newImg = newImg.imageSrc.replace('_SX100_', '_SX400_');
    }
    
    return newImg;
}

const checkUnavailable = async(imgUrl) => {
    try{
        const url = `http://localhost:3001/api/unavailable`;
        const unavailableImg1 = 'https://books.google.com/books/content?id=_zSzAwAAJ&printsec=frontcover&img=1&zoom=6&edge=curl&source=gbs_api';
        const unavailableImg2 = 'https://books.google.com/books/content?id=gRJSEAAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api';
        let { data } = await axios.get(url, {
            params: { imgUrl, "unavailableImgs": [unavailableImg1, unavailableImg2]}
        });

        return data;

    }catch(error){        
        return error;
    }
}

const checkImg = async(imgUrl, title, author) => {
    try{
        // checks if image is unavailable and if so scrapes for new img
        const { differences } = await checkUnavailable(imgUrl);

        if(differences[0] === 0 || differences[1] === 0){
            const newCover = await scrapeBookCover(title, author, imgUrl);

            if(newCover.imageFound === false){
                return imgUrl;
            }

            return newCover;
        }

        return imgUrl;
    }catch(error){
        if(error){
            return { "Error checking cover ": true };
        }
    }
}

// Use checkImg
export { checkImg } ;

