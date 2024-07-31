const router = require('express').Router();
const { createCanvas, loadImage } = require('canvas');

router.get('/', async (req, res) => {
    const { imgUrl } = req.query;
    console.log("test", imgUrl);
    if (!imgUrl) {
        return res.status(400).json({ error: 'testImgUrl are required' });
    }
    try{
        const img = await loadImage(imgUrl);

        const width = img.width;
        const height = img.height;

        console.log(`Width: ${width}, Height: ${height}`)
        return res.json({ width, height });
    }catch(error){
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;