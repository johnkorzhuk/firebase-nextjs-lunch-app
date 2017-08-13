const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const next = require('next');
const admin = require('firebase-admin');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const credentials = require('./credentials/server');

const firebase = admin.initializeApp(
  {
    credential: admin.credential.cert(credentials),
    databaseURL: 'https://lunch-app-7a5e3.firebaseio.com'
  },
  'server'
);

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());
  server.use(
    session({
      secret: 'geheimnis',
      saveUninitialized: true,
      store: new FileStore({ path: '/tmp/sessions', secret: 'geheimnis' }),
      resave: false,
      rolling: true,
      httpOnly: true,
      cookie: { maxAge: 604800000 } // week
    })
  );

  server.use((req, res, next) => {
    req.firebaseServer = firebase;
    next();
  });

  server.post('/api/login', (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const token = req.body.token;

    return Promise.all([
      firebase.auth().verifyIdToken(token).then(decodedToken => decodedToken),
      firebase.database().ref('/restaurants').once('value', snap => snap.val())
    ])
      .then(data => {
        const [decodedToken, restaurants] = data;
        req.session.decodedToken = decodedToken;
        req.session.restaurants = restaurants;
        return res.json({ status: true, decodedToken, restaurants });
      })
      .catch(error => res.json({ error }));
  });

  server.post('/api/logout', (req, res) => {
    req.session.decodedToken = null;
    req.session.restaurants = null;
    res.json({ status: true });
  });

  server.get('*', (req, res) => handle(req, res));

  const listener = server.listen(3000, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${listener.address().port}`);
  });
});
