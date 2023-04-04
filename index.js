const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');
// const { PeerProxy } = require('./peerProxy.js');

const authCookieName = 'token';

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the applications static content
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
    if (await DB.getUser(req.body.username)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await DB.createUser(req.body.email, req.body.password);
    
        // Set the cookie
        setAuthCookie(res, user.token);
    
        res.send({
            id: user._id,
        });
    }
});
  
  // GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
    const user = await DB.getUser(req.body.email);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            setAuthCookie(res, user.token);
            res.send({ id: user._id });
            return;
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});
  
  // DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
    res.clearCookie(authCookieName);
    res.status(204).end();
});
  
// GetUser returns information about a user
apiRouter.get('/user/:username', async (req, res) => {
    const user = await DB.getUser(req.params.username);
    if (user) {
      const token = req?.cookies.token;
      res.send({ username: user.username, authenticated: token === user.token });
      return;
    }
    res.status(404).send({ msg: 'Unknown' });
});

var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
    const authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    if (user) {
      next();
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
});

// Get cards for a set
secureApiRouter.get('/cards', async (req, res) => {
    const cardSet = await DB.getCards(req.body.setName);
    res.send(cardSet);
});

// Get card sets
secureApiRouter.get('/cardsets', async (_req, res) => {
    const sets = await DB.getCardsets();
    res.send(sets);
});

// Add a new card
secureApiRouter.post('/card', async (req, res) => {
    const result = await DB.addCard(req.body);
    res.send(result);
});

// Add a new card set
secureApiRouter.post('/cardset', async (req, res) => {
    if (await DB.getCardsets(req.body.setName)) {
        res.status(409).send({ msg: 'Existing cardset' });
    }
    const result = await DB.addCardset(req.body);
    res.send(result);
});

// Edit a card
secureApiRouter.put('/card', async (req, res) => {
    const result = await DB.updateCard(req.body);
    res.send(result);
});

// Edit a card set
secureApiRouter.put('/cardset', async (req, res) => {
    const result = await DB.updateCardset(req.body);
    res.send(result);
});

// Delete a card
secureApiRouter.delete('/card', async (req, res) => {
    const result = await DB.addCard(req.body);
    res.send(result);
});

// Delete a card set
secureApiRouter.delete('/cardset', async (req, res) => {
    const result = await DB.deleteCardset(req.body);
    res.send(result);
});


// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

//set auth cookie in the http response 
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
  }

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

