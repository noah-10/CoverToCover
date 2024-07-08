
const quotes = [
    { quote: "Today a reader, tomorrow a leader.", author: "Margaret Fuller" },
    { quote: "A word after a word after a word is power.", author: "Margaret Atwood" },
    { quote: "One glance at a book and you hear the voice of another person, perhaps someone dead for 1,000 years. To read is to voyage through time.", author: "Carl Sagan" },
    { quote: "Show me a family of readers, and I will show you the people who move the world.", author: "Napoleon Bonaparte" },
    { quote: "A book is a garden, an orchard, a storehouse, a party, a company by the way, a counselor, a multitude of counselors.", author: "Charles Baudelaire" },
    { quote: "Reading should not be presented to children as a chore, a duty. It should be offered as a gift.", author: "Kate DiCamillo" },
    { quote: "I think books are like people, in the sense that they’ll turn up in your life when you most need them.", author: "Emma Thompson" },
    { quote: "Books are a uniquely portable magic.", author: "Stephen King" },
    { quote: "Books are mirrors: You only see in them what you already have inside you.", author: "Carlos Ruiz Zafón" },
    { quote: "Let’s be reasonable and add an eighth day to the week that is devoted exclusively to reading.", author: "Lena Dunham" },
    { quote: "If you don’t like to read, you haven’t found the right book.", author: "J.K. Rowling" },
    { quote: "I can feel infinitely alive curled up on the sofa reading a book.", author: "Benedict Cumberbatch" },
    { quote: "Some books leave us free and some books make us free.", author: "Ralph Waldo Emerson" },
    { quote: "We tell ourselves stories in order to live.", author: "Joan Didion" },
    { quote: "Books and doors are the same thing. You open them, and you go through into another world.", author: "Jeanette Winterson" },
    { quote: "A good would take me out of myself and then stuff me back in, outsized, now, and uneasy with the fit.", author: "David Sedaris" },
    { quote: "Have books ‘happened’ to you? Unless your answer to that question is ‘yes,’ I’m unsure how to talk to you.", author: "Haruki Murakami" },
    { quote: "Once you learn to read, you will be forever free.", author: "Frederick Douglass" },
    { quote: "A room without books is like a body without a soul.", author: "Cicero" },
    { quote: "The reading of all good books is like a conversation with the finest minds of past centuries.", author: "Rene Descartes" },
]

export const getQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);

    return quotes[randomIndex];
}