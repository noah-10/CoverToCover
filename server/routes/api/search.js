const router = require('express').Router();
const puppeteer = require('puppeteer')

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
                return img ? img.src : null
            })
        })

        console.log("all imgs", allImgs);
        await browser.close();
        res.json(allImgs);

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;