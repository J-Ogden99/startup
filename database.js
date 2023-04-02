const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
    throw Error('Database not configured. Set environment variables');
  }
  
const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const userCollection = client.db('startup').collection('user');
const cardCollection = client.db('startup').collection('card');
const cardsetCollection = client.db('startup').collection('cardset');

function getUser(username) {
return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
    // Hash the password before we insert it into the database
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        email: email,
        password: passwordHash,
        token: uuid.v4(),
    };
    await userCollection.insertOne(user);

    return user;
}

async function createUser(email, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };

  return collection.insertOne(user);
}

function addCard(req) {
    return cardCollection.insertOne(req);
}

function getCards(setName) {
    return cardCollection.find({ setName: setName });
}

async function updateCard(req) {
    const id = req.id;
    return db.cardCollection.updateOne(
        { _id: id },
        { $set: req }
    )
}

function deleteCard(req) {
    const id = req.id;
    return cardCollection.deleteOne({ _id: id })
}

function addCardset(setName) {
    const cardSet = {
        'name': setName
    }
    return cardsetCollection.insertOne(cardSet);
}

function getCardsets(req = "all") {
    if (req === "all")
        return cardsetCollection.find();
    const name = req.setName;
    return cardsetCollection.findOne({ name: name })
}

function updateCardset(req) {
    const id = req.id;
    return db.cardsetCollection.updateOne(
        { _id: id },
        { $set: req }
    );
}

async function deleteCardset(req) {
    const id = req.id;
    const setName = req.name;
    const cardDel = await cardCollection.deleteMany({ setName: setName });
    if (cardDel.acknowledged)
        return cardsetCollection.deleteOne({ _id: id });
    return cardDel;
}


module.exports = {
    getUser,
    getUserByToken,
    createUser,
    addCard,
    getCards,
    addCardset,
    getCardsets,
    updateCard,
    updateCardset,
    deleteCard,
    deleteCardset,
};
  