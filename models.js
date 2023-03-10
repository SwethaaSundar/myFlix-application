const  { default: mongoose } = require("mongoose");

let movieSchema = mongoose.Schema({
    title : {type: String, required: true},
    description : {type: String, required: true},
    imgUrl : String,
    year: Date,
    genre: {
        gName : String,
        gDescription: String,
    },
    director: {
        dName: String,
        dBio: String,
        dYear: Date
    }
});

let userSchema = mongoose.Schema({
    Name: {type: String , required: true},
    FavMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movies'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User',userSchema);

module.exports.Movie = Movie;
module.exports.User = User;