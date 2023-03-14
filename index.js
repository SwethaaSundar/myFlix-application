const express = require('express'),
app = express(),
morgan = require('morgan'),
fs = require('fs')
bodyParser = require('body-parser') ,
uuid = require('uuid')
path = require('path');
const mongoose = require('mongoose');
const Models = require('./models.js');

// const Genre = mongoose.model("Genre", genreSchema);
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1:27017/myFlix', { useNewUrlParser: true, useUnifiedTopology: true });
console.log('success connection');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// to import auth.js file... the (app) argument is to ensure Express is available in the auth.js file as well
let auth = require('./auth')(app);
//to require passport module and import passport.js file
const passport = require('passport');
require('./passport');

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flag: 'a'})
app.use(morgan('common', { stream: accessLogStream }));
app.use('/documentation',express.static('Public'));

// GET Method
// GET request (Read from server)- Home page
app.get('/', (req, res)=>{
  res.send('Welcome to the Disney movies list!\n');
});
// GET all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req,res)=>{
  Movies.find()
  .then((movie) => {
    res.status(200).json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});  

// GET all users
app.get('/users', (req,res)=>{
  Users.find()
  .then((user) => {
    res.status(200).json(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
// GET movies by name
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// GET movies by genre
app.get('/movies/genre/:gName', passport.authenticate('jwt', { session: false }), (req, res) => {
 Movies.findOne({ 'genre.gName': req.params.gName })
    .then((movie) => {
      // console.log(movie.genre);
      res.json(movie.genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// GET movies by director
app.get('/movies/director/:dName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'director.dName' : req.params.dName })
    .then((movie) => {
      res.json(movie.director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// POST Method
// Create new user 
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            FavMovies: req.body.FavMovies
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});
// Adding favorite movies
app.post('/users/:Username/movies/:Movieid', passport.authenticate('jwt', { session: false }), (req,res)=>{
   Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
       $push: { favMovies: req.params.Movieid }
    },
    { new: true, select: "Username FavMovies" }) // This line makes sure that the updated document is returned
    .then((users)=>{
      res.status(200).json(users)
    }
    ).catch(
      err => console.error("Something went wrong"),
    )
});

// PUT Method
//updating the user name
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req,res)=>{
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
       $set: { name: req.body.name }
    },
    { new: true, select: "Username" }) // This line makes sure that the updated document is returned
    .then((users)=>{
      res.status(200).json(users)
    }
    ).catch(
      err => console.error("Something went wrong"),
    )
});

// DELETE Method
// Deleting the movies from the favorite list----------
app.delete('/users/:Username/movies/:Movieid', passport.authenticate('jwt', { session: false }), (req,res)=>{
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
       $pull: { favMovies: req.params.Movieid }
    },
    { new: true, select: "Username FavMovies" })
    .then((users)=>{
      res.status(200).json(users)
    }
    ).catch(
      err => console.error("Something went wrong"),
    )
});
// Allow user to de-register
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).send('Something broke!');
});
// Listen 
app.listen(8080,()=>{
  console.log('My first Node test server is running on Port 8080');
})
