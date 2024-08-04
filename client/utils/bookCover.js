import axios from 'axios';
import * as cheerio from 'cheerio';
import pixelmatch from 'pixelmatch'
import { createCanvas, loadImage } from 'canvas'


const calculateDifference = async (testImg, originalCover) => {
    try {
        const url = `http://localhost:3001/api/calculate`;
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

    data = data.filter(url => url !== null);

    let highestGradedImg = null;
    // Lower the score the more a like the imgs are
    let lowestScore = 1;

    for (const book of data) {
        if(!book)return;
        const score = await calculateDifference(book, originalCover);
        console.log("score", score);
        if (score < lowestScore) {
            lowestScore = score;
            highestGradedImg = book;
        }
    }

    if(lowestScore > 0.15){
        highestGradedImg = data[0];
    }

    highestGradedImg = highestGradedImg.replace('_SX50_', '_SX400_');

    return highestGradedImg;
}

const checkImgSize = async(imgUrl, title, author) => {
    console.log(imgUrl)
    try{
        const url = `http://localhost:3001/api/check`;
        let { data } = await axios.get(url, {
            params: { imgUrl }
        });
        console.log(data.height);

        // For when increasing zoom doesn't work on an img
        if(data.height < 750){
            
            imgUrl = imgUrl.replace('zoom=4', 'zoom=1');
            const newCover = await scrapeBookCover(title, author, imgUrl);

            return newCover;
        }else{
            return imgUrl;
        }

    }catch(error){
        return console.error("Error checking images: ", error);
    }
}

export {checkImgSize, scrapeBookCover} ;

