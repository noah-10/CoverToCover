const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const { createCanvas, loadImage } = require('canvas')
const { typeDefs, resolvers } = require('./schema');
const db = require('./config/connection');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

app.use(cors());
app.use(routes);



app.get('/api/calculate', async (req, res) => {
    console.log('Received request - body', req.query)
    const { testImg, originalCover } = req.query;
    console.log("testimg", testImg);
    console.log("originalCover", originalCover);
    if (!testImg || !originalCover) {
        return res.status(400).json({ error: 'testImgUrl and originalCoverUrl are required' });
    }
    try {
        const { default: pixelmatch } = await import('pixelmatch');
        const img1 = await loadImage(originalCover);
        const img2 = await loadImage(testImg);

        const width = img1.width;
        const height = img1.height;

        const canvas1 = createCanvas(width, height);
        const ctx1 = canvas1.getContext('2d');
        ctx1.drawImage(img1, 0, 0, width, height);
        const imgData1 = ctx1.getImageData(0, 0, width, height);
        console.log(imgData1)
        const canvas2 = createCanvas(width, height);
        const ctx2 = canvas2.getContext('2d');
        ctx2.drawImage(img2, 0, 0, width, height);
        const imgData2 = ctx2.getImageData(0, 0, width, height);
        console.log(imgData2)
        const diffCanvas = createCanvas(width, height);
        const diffCtx = diffCanvas.getContext('2d');
        const diffData = diffCtx.createImageData(width, height);

        const numDiffPixels = pixelmatch(imgData1.data, imgData2.data, diffData.data, width, height, { threshold: 0.1 });

        const totalPixels = width * height;
        const differenceRatio = numDiffPixels / totalPixels;

        const roundedDifferenceRatio = differenceRatio.toFixed(3);

        console.log(`Difference ratio: ${roundedDifferenceRatio}`);
        res.json(roundedDifferenceRatio);

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

const startApolloServer = async () => {
    await server.start();

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json({ limit: '10mb' }));

    app.use('/graphql', expressMiddleware(server, {
        context: authMiddleware
    }));

    if(process.env.NODE_ENV === 'production'){
        app.use(express.static(path.join(__dirname, '../client/dist')));

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });
    };

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server is running on port ${PORT}`);
            console.log(`graphql running at http://localhost:${PORT}/graphql`);
        });
    });
};

startApolloServer();