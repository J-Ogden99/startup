const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const cookieParser = require('cookieparser');

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


//User Authentication

app.post('/auth/create', async (req, res) => {
    if (await getUser(req.body))
})


async function createUser(email, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await collection.insertOne(user);

  return user;
}