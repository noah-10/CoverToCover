const router = require('express').Router();
const puppeteer = require('puppeteer')

// scrapes book cover if needed
router.get('/', async (req, res) => {
    console.log('Received request')
    const { query } = req.query;
    const url = `https://www.librarything.com/search.php?search=${query}&searchtype=newwork_titles&sortchoice=0`;
    console.log('Fetching URL:', url);

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        await page.waitForSelector('div main div section div table tbody tr');

        const allImgs = await page.evaluate(() => {
            const searchResults = document.querySelectorAll('div main div section div table tbody tr');
            console.log(searchResults.length);

            return Array.from(searchResults).map((result) => {
                const img = result.querySelector('td.i a img');
                console.log({"imageSrc":img.src, "imageSrcSet": img.srcset})
                return img ? {"imageSrc":img.src, "imageSrcSet": img.srcset} : null
            })
        })

        console.log("all imgs", allImgs);
        await browser.close();
        res.json({allImgs, "timoutExceeded": false});

    } catch (error) {
        console.log("error.message", error.message);
        if(error.message.includes('Navigation timeout') || error.message.includes("TimeoutError")  || error.message.includes("Cannot read properties of null") || error.message.includes('Waiting for selector')){
            console.log("timeout was exceeded");
            res.json({ "timoutExceeded": true })
        }else{
            console.error('Error scartching imgs:', error);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
       
    }
});

module.exports = router;