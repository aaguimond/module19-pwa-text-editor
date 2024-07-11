import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  // for dev: logging route function to console
  console.log('PUT to db');
  // define db
  const jateDb = await openDB('jate', 1);
  // define what transactions are allowed
  const tx = jateDb.transaction('jate', 'readwrite');
  // define jate as the stored object
  const store = tx.objectStore('jate');
  // define what our request will be (to update)
  const request = store.put({ id: 1, jate: content });
  // await the result of our request
  const result = await request;
  // for dev: log result of request
  console.log('PUT data saved to db', result);
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  // for dev: logging route function to console
  console.log('GET all from db');
  // define db
  const jateDb = await openDB('jate', 1);
  // define what transactions are allowed
  const tx = jateDb.transaction('jate', 'readonly');
  // define jate as the stored object
  const store = tx.objectStore('jate');
  // define what our request will be (to get all)
  const request = store.getAll();
  // await the result of our request
  const result = await request;
  // for dev: log result of request
  console.log('result.value', result);
};

initdb();
