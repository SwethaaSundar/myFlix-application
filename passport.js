const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

  exports.findUser = function findUser(username, callback){
    Users.findOne({Username: username}, function(err, userObj){
        if(err){
            return callback(err);
        } else if (userObj){
            return callback(null,userObj);
        } else {
            return callback();
        }
    });
}

passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  console.log(username + '  ' + password);
  // Users.findOne({ Username: username }, (error, user) => {
  //   if (error) {
  //     console.log(error);
  //     return callback(error);
  //   }

  //   if (!user) {
  //     console.log('incorrect username');
  //     return callback(null, false, {message: 'Incorrect username or password.'});
  //   }
  //   console.log('finished');
  //   return callback(null, user);
  // });
  Users.findOne({ Username: username })
  .then((user) => {
    if(user){
    console.log('finished');
    return callback(null, user);
    }
    if (!user) {
          console.log('incorrect username');
          return callback(null, false, {message: 'Incorrect username or password.'});
        }
   if (!user.validatePassword(password)) {
      console.log('incorrect password');
      return callback(null, false, {message: 'Incorrect password.'});
    }  
  })
  .catch((error) => {
    console.log(error);
    return callback(error);
  });
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
  return Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));