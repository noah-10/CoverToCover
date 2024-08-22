const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const cors = require('cors');
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