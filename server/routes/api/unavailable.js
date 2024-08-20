const router = require('express').Router();
const { createCanvas, loadImage } = require('canvas');

router.get('/', async (req, res) => {
    try{
        const { imgUrl } = req.query;
        const unavailableImg = 'https://books.google.com/books/content?id=_zSzAwAAJ&printsec=frontcover&img=1&zoom=6&edge=curl&source=gbs_api'

        if(!imgUrl){
            return res.status(400).json({ error: "imgUrl query is required"});
        }

        const { default: fetch } = await import('node-fetch');

        // fetch and load images
        const fetchImage = async (url) => {
            const response = await fetch(url);
            if(!response.ok) throw new Error("failed to fetch image");
            const arrayBuffer = await response.arrayBuffer();
            return loadImage(Buffer.from(arrayBuffer)); 
        };

        // load images
        const [img1, img2] = await Promise.all([
            fetchImage(imgUrl),
            fetchImage(unavailableImg),
        ]);

        const width = Math.min(img1.width, img2.width);
        const height = Math.min(img1.height, img2.height);

        //  create canvas and context
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // resize and draw first img
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img1, 0, 0, width, height);
        const img1Data = ctx.getImageData(0, 0, img1.width, img1.height);
        
        // resize and draw second img
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img2, 0, 0, width, height);
        const img2Data = ctx.getImageData(0, 0, img2.width, img2.height);

        // Create a new ImageData object to hold the diff
        const diff = ctx.createImageData(width, height);

        const { default: pixelmatch } = await import('pixelmatch');

        // compare imgs
        const numDiffPixels = pixelmatch(
            img1Data.data, img2Data.data, diff.data, width, height, { threshold: 0.1 }
        );
        // console.log("numDiffPixels", numDiffPixels);
        const totalPixels = width * height;
        const decimalDifference = numDiffPixels / totalPixels;

        console.log("decimal difference", decimalDifference);
        res.json({ decimalDifference })

    }catch(error){
        console.error("Error checking for unavailablity", error);
    }
})

module.exports = router;