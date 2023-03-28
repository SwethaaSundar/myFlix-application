const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  fs = require("fs");
(bodyParser = require("body-parser")), (uuid = require("uuid"));
path = require("path");
const mongoose = require("mongoose");
const Models = require("./models.js");
const { check, validationResult } = require("express-validator");

// const Genre = mongoose.model("Genre", genreSchema);
const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://127.0.0.1:27017/myFlix', { useNewUrlParser: true, useUnifiedTopology: true });
// console.log('success connection');
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("strictQuery", false);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// cors
const cors = require("cors");
app.use(cors());
// let allowedOrigins = [
//   "http://localhost:8080",
//   "http://localhost:1234",
//   "https://myflixdb-0sx9.onrender.com",
//   "https://myflixdb-0sx9.onrender.com/login",
//   "https://disneyprincess.fandom.com", //Img url
// ];
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         // If a specific origin isn’t found on the list of allowed origins
//         let message =
//           "The CORS policy for this application doesn't allow access from origin " +
//           origin;
//         return callback(new Error(message), false);
//       }
//       return callback(null, true);
//     },
//   })
// );
// to import auth.js file... the (app) argument is to ensure Express is available in the auth.js file as well
require("./auth")(app);
//to require passport module and import passport.js file
const passport = require("passport");
require("./passport");

let accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flag: "a",
});
app.use(morgan("common", { stream: accessLogStream }));
app.use(express.static("Public"));

// GET Method
// GET request (Read from server)- Home page
app.get("/", (req, res) => {
  // res.send('Welcome to the Disney movies list!\n');
  res.redirect("/documentation.html");
});
// GET all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // app.get("/movies", (req, res) => {
    Movies.find()
      .then((movie) => {
        res.status(200).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
// GET all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
// GET movies by name
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ title: req.params.title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
// GET movies by genre
app.get(
  "/movies/genre/:gName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "genre.gName": req.params.gName })
      .then((movie) => {
        // console.log(movie.genre);
        res.json(movie.genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
// GET movies by director
app.get(
  "/movies/director/:dName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "director.dName": req.params.dName })
      .then((movie) => {
        res.json(movie.director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// POST Method
// Create new user
app.post(
  "/users",
  [
    //validation logic goes here
    check("Username", "Username is required").isLength({ min: 4 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Password", "Password is required").isLength({ min: 8 }),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            // Password: req.body.Password,
            Password: hashedPassword,
            Email: req.body.Email,
            FavMovies: req.body.FavMovies,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);
// Adding favorite movies
app.post(
  "/users/:Username/movies/:Movieid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavMovies: req.params.Movieid },
      },
      { new: true, select: "Username Password Email FavMovies" }
    ) // This line makes sure that the updated document is returned
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => console.error("Something went wrong"));
  }
);

// PUT Method
//updating the user name
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: { Username: req.body.Username },
      },
      { new: true, select: "Username Password Email FavMovies" }
    ) // This line makes sure that the updated document is returned
      .then((user) => {
        console.log(user);
        res.status(200).json(user);
      })
      .catch((err) => console.error("Something went wrong"));
  }
);

// DELETE Method
// Deleting the movies from the favorite list
app.delete(
  "/users/:Username/movies/:Movieid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavMovies: req.params.Movieid },
      },
      { new: true, select: "Username Password Email FavMovies" }
    )
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => console.error("Something went wrong"));
  }
);
// Allow user to de-register
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).send("Something broke!");
});
// Listen
// app.listen(8080,()=>{
//   console.log('My first Node test server is running on Port 8080');
// })
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
