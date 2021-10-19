import connection from './connection';

const getAll = async () => {
  const db = await connection();
  const messages = await db.collection('doctorwellchat').find().toArray();
  return messages;
}

const create = async (firstName, middleName, lastName) =>
  db()
    .then((db) => db.collection('authors').insertOne({ firstName, middleName, lastName }))
    .then(result => getNewAuthor({ id: result.insertedId, firstName, middleName, lastName }));

export default chatModel;
