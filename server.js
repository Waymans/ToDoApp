const express = require('express');
const passport = require('passport');
const Strategy = require('passport-github').Strategy;
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI;

let db;
let collection;
let dbClient;

MongoClient.connect(uri, { useNewUrlParser: true })
.then(client => {
  console.log("Connected successfully to server");
  db = client.db('login');
  collection = db.collection('todo');
  dbClient = client;
}).catch(error => console.error(error));

passport.use(new Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'https://beautiful-sky.glitch.me/login/github/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    collection.updateOne({ _id: profile.id }, { $setOnInsert:{ _id: profile.id, todo: [], done: [] } }, { upsert: true })
      .catch(err => console.log(err));
    return cb(null, profile);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const app = express();

app.use(express.static(process.cwd() + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: process.env.SECRET, resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req, res) => {
  console.log(req.user)
  res.render('home', { user: req.user });
});

//login
app.get('/login/github',passport.authenticate('github'));

app.get('/login/github/return', passport.authenticate('github', { failureRedirect: '/' }),(req, res) => {
  res.redirect('/');
});

//database - todo list
app.route('/todo/:id')
  .get((req,res) => {
    var id = req.params.id;
    collection.findOne({ _id: id })
      .then(data => res.status(200).json(data))
      .catch(error => console.error(error));
  })
  .put((req,res) => {
    var thing = req.body.thing, id = req.params.id;
    collection.updateOne({ _id: id }, { $push:{ todo: thing } })
      .then(data => res.json({ todo: [thing] }))
      .catch(err => console.log(err)); 
  })
  .delete((req,res) => {
    var id = req.params.id, thing = req.body.thing;
    collection.updateOne({ _id: id }, { $pull:{ todo: thing } })
      .then(data => res.status(200).json(data))
      .catch(error => console.error(error));
  });
app.put('/check/:id',(req,res) => {
  var thing = req.body.thing, id = req.params.id;
  collection.updateOne({ _id: id }, { $pull:{ todo: thing } })
  collection.updateOne({ _id: id }, { $push:{ done: thing } })
    //.then(data => res.json({ todo: thing }))
    .catch(err => console.log(err));
  });
app.put('/uncheck/:id',(req,res) => {
  var thing = req.body.thing, id = req.params.id;
  collection.updateOne({ _id: id }, { $pull:{ done: thing } })
  collection.updateOne({ _id: id }, { $push:{ todo: thing } })
    //.then(data => res.json({ todo: thing }))
    .catch(err => console.log(err));
  });
app.delete('/remove/:id',(req,res) => {
  var id = req.params.id, thing = req.body.thing;
  collection.updateOne({ _id: id }, { $pull:{ done: thing } })
    .then(data => res.status(200).json(data))
    .catch(error => console.error(error));
  });

//logout
app.get('/log', function(req, res){
  req.logOut();
  req.session.destroy(function (err) {
    res.redirect('/logout');
  });
});

app.get('/logout',(req, res) => {
  res.render('logout');
});

process.on('SIGINT', () => {
    dbClient.close();
    process.exit();
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
