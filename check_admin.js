import db from './src/db/index.js';

const admins = db.prepare('SELECT * FROM admins').all();
console.log('Admins:', admins);
