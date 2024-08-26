const router = require('express').Router();
const puppeteer = require('puppeteer')

// scrapes book cover if needed
router.get('/', async (req, res) => {
    const { query } = req.query;
    const url = `https://www.librarything.com/search.php?search=${query}&searchtype=newwork_titles&sortchoice=0`;

    try {
        console.log("recieved request search")
        const browser = await puppeteer.launch({
            executablePath: puppeteer.executablePath(), // or provide the exact path if you know it
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          });
        const page = await browser.newPage();
        await page.goto(url);

        await page.waitForSelector('div main div section div table tbody tr');

        const allImgs = await page.evaluate(() => {
            const searchResults = document.querySelectorAll('div main div section div table tbody tr');

            return Array.from(searchResults).map((result) => {
                const img = result.querySelector('td.i a img');
                return img ? {"imageSrc":img.src, "imageSrcSet": img.srcset} : null
            })
        })

        await browser.close();
        res.json({allImgs, "timoutExceeded": false});

    } catch (error) {
        console.error(error);
        if(error.message.includes('Navigation timeout') || error.message.includes("TimeoutError")  || error.message.includes("Cannot read properties of null") || error.message.includes('Waiting for selector')){
            res.json({ "timoutExceeded": true })
        }else{
            console.log("error", error)
            res.status(500).json({ error: 'Failed to fetch data' });
        }
       
    }
});

module.exports = router;