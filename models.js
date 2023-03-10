const  { default: mongoose } = require("mongoose");

let movieSchema = mongoose.Schema({
    Title : {type: String, required: true},
    Description : {type: String, required: true},
    ImgUrl : String,
    Release : Date,
    Genre: {
        Name : String,
        Description: String,
    },
    Director: {
        Name: String,
        Bio: String,
        Birthday: Date
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