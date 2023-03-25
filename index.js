const express = require('express');
const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use('/api', apiRouter);

// Get cards for a set
apiRouter.get('/cards', (req, res) => {
    let cardSet = getCards(req.body.setName);
    res.send(cardSet);
});

// Get card sets
apiRouter.get('/cardsets', (_req, res) => {
    let sets = getCardSets();
    res.send(sets);
});

// Add a new card
apiRouter.post('/card', (req, res) => {
    let result = postCard(req.body);
    res.send(result);
});

// Add a new card set
apiRouter.post('/cardset', (req, res) => {
    let result = postCardSet(req.body);
    res.send(result);
});


// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

function getCards(setName) {

}

function getCardSets(setName) {

}

function postCard(info) {

}

function postCardSet(info) {

}
