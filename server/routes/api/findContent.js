const router = require('express').Router();
const OpenAI = require('openai');

// finds new content
router.get('/', async (req, res) => {
    const { prompt } = req.query;
    const key = process.env.OPENAI_API_KEY;
    try{
        const openai = new OpenAI({ apiKey: key });

        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            prompt: prompt,
            max_tokens: 2000,
        });

        return res.json(response);

    }catch(error){
        return res.json(error);
    }
})

module.exports = router;