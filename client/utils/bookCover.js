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

    // title and author joined
    const joined = title.concat(' by ', author);

    // create query
    const query = joined.split(" ").join("+");
 
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
        let { data } = await axios.get(url, {
            params: { imgUrl }
        });

        return data;

    }catch(error){
        return error;
    }
}

const checkImg = async(imgUrl, title, author) => {
    try{
        // checks if image is unavailable and if so scrapes for new img
        const { decimalDifference } = await checkUnavailable(imgUrl);

        if(decimalDifference === 0){
            const newCover = await scrapeBookCover(title, author, imgUrl);
            return newCover;
        }

        return imgUrl;
    }catch(error){
        return console.error("Error checking images: ", error);
    }
}

export {checkImg, scrapeBookCover} ;

