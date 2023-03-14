const  { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');

let genreSchema = mongoose.Schema({
    gName : {type: String},
    gDescription: {type: String}, 
});
let directorSchema = mongoose.Schema({
    dName: {type: String},
    dBio: {type: String},
    dYear: Date
});
let movieSchema = mongoose.Schema({
    title : {type: String, required: true},
    description : {type: String, required: true},
    imgUrl : String,
    year: Date,
    genre: {
        type: genreSchema,
    },
    director: {
        type: directorSchema,
    }
});

let userSchema = mongoose.Schema({
    Username: {type: String , required: true},
    // password: {type: String , required: true},
    Password: {type: String , required: true},
    Email: {type: String , required: true},
    FavMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movies'}]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  
  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };


let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User',userSchema);

module.exports.Movie = Movie;
module.exports.User = User;