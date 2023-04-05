const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
    throw Error('Database not configured. Set environment variables');
    console.log(userName)
    console.log(password)
    console.log(hostname)
}
  
const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const userCollection = client.db('startup').collection('user');
const cardCollection = client.db('startup').collection('card');
const cardsetCollection = client.db('startup').collection('cardset');


async function getUser(username) {
    const cursor =  await userCollection.findOne({ username: username });
    console.log(cursor);
    return cursor;
}

async function getUserByToken(token) {
    const cursor =  await userCollection.findOne({ token: token });
    return cursor;
}

// async function createUser(username, password) {
//     // Hash the password before we insert it into the database
//     const passwordHash = await bcrypt.hash(password, 10);

//     const user = {
//         username: username,
//         password: passwordHash,
//         token: uuid.v4(),
//     };
//     await userCollection.insertOne(user);

//     return user;
// }

async function createUser(username, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);
  console.log(username);

  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
  };

  const cursor = await userCollection.insertOne(user);
  return cursor;
}

async function addCard(req) {
    const cursor = await cardCollection.insertOne(req);
    return cursor;
}

async function getCards(setId) {
    const cursor = cardCollection.find({ _setid: setId });
    return cursor.toArray();
}

async function updateCard(req) {
    const id = req.id;
    const cursor = await cardCollection.updateOne(
        { _id: id },
        { $set: req }
    );
    return cursor;
}

function deleteCard(req) {
    const id = req.id;
    return cardCollection.deleteOne({ _id: id }).toArray();
}

function addCardset(setName, desc) {
    const cardSet = {
        'name': setName,
        'desc': desc
    }
    return cardsetCollection.insertOne(cardSet);
}

function getCardsets(req = "all", setName = "") {
    if (req === "all")
        return cardsetCollection.find({}).toArray();
    const name = setName;
    const cursor = cardsetCollection.findOne({ name: name });
    return cursor;
}

function updateCardset(req) {
    const id = req.id;
    return db.cardsetCollection.updateOne(
        { _id: id },
        { $set: req }
    ).toArray();
}

async function deleteCardset(id) {
    const cardDel = await cardCollection.deleteMany({ _setid: ObjectId(id) })
    const cursor = await cardsetCollection.deleteOne({ _id: ObjectId(id) });
    // if (cardDel.acknowledged)
    //     return cardsetCollection.deleteOne({ _id: id }).toArray();
    return cursor;
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
  