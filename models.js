const  { default: mongoose } = require("mongoose");


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
    Password: String,
    Email: String,
    FavMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movies'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User',userSchema);

module.exports.Movie = Movie;
module.exports.User = User;