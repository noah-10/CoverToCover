import axios from 'axios';
import * as cheerio from 'cheerio';
import pixelmatch from 'pixelmatch'
import { createCanvas, loadImage } from 'canvas'


const calculateDifference = async (testImg, originalCover) => {
    try {
        console.log('testImg', testImg)
        const url = `http://localhost:3001/api/compare`;
        const {data} = await axios.get(url, {
            params: { testImg, originalCover }
        });
        return data;

    } catch (error) {
        return console.error("Error loading images: ", error);
    }
};
  

const scrapeBookCover = async (title, author, originalCover) => {

    let query = '';

    //  Create a query based on the length of title
    if(title.length <= 12){
        // title and author joined
        const joined = title.concat(' by ', author);
        query = joined.split(" ").join("+");
    }else{
        query = title.split(" ").join("+");
    }
 
    const url = `http://localhost:3001/api/search`;
    let { data } = await axios.get(url, {
        params: { query }
    });
    console.log("data", data);
    if(data.timoutExceeded === true){
        return;
    }
    data = data.allImgs.filter(url => url !== null);

    let newImg = data[0];

    console.log("highest grade", newImg);

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
        const unavailableImg2 = 'https://books.google.com/books/content?id=gRJSEAAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api'
        let { data } = await axios.get(url, {
            params: { imgUrl, "unavailableImgs": [unavailableImg1, unavailableImg2]}
        });
        console.log(data);

        return data;

    }catch(error){
        console.log(error);
        return error;
    }
}

const checkImg = async(imgUrl, title, author) => {
    try{
        // checks if image is unavailable and if so scrapes for new img
        const { differences } = await checkUnavailable(imgUrl);
        console.log(differences)
        if(differences[0] === 0 || differences[1] === 0){
            const newCover = await scrapeBookCover(title, author, imgUrl);
            return newCover;
        }

        return imgUrl;
    }catch(error){
        return console.error("Error checking images: ", error);
    }
}

export {checkImg, scrapeBookCover} ;

