const express = require('express'),
app = express(),
morgan = require('morgan'),
fs = require('fs')
bodyParser = require('body-parser') ,
uuid = require('uuid')
path = require('path');

app.use(bodyParser.json());
// User's list
let appUsers = [
  {
    id: 1,
    name: 'Swethaa',
    favMovies: ["Snow White and the 7 Dwarfs", "Moana"]
  },
  {
    id: 2,
    name: 'Benni',
    favMovies: []
  },
  {
    id: 3,
    name: 'Lisa',
    favMovies: ["Sleeping Beauty'", "Moana", "Aladdin", "Mulan"]
  }];
// Disney Movies list
let disneyMovies = [
  {
    title : 'Snow White and the 7 Dwarfs',
    description: 'The jealous Evil Queen decided to be rid of Snow White so that she would be fairest in the land, but the spell can be broken by True Love\'s Kiss.',
    imgUrl: 'https://disneyprincess.fandom.com/wiki/Snow_White_and_the_Seven_Dwarfs?file=SWATSD_poster.jpg',
    year: '1937',
    genre:{
        gName:'Fantasy',
        gDescription: 'Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds'
    },
    director:{
      dName: 'David Dodd Hand',
      dBio: 'An American animator and animation filmmaker known for his work at Walt Disney Productions. He worked on numerous Disney shorts during the 1930s and eventually became supervising director on the animated features Snow White and the Seven Dwarfs and Bambi. ',
      dYear: '1900 - 1986'
    }
  },
  {
    title : 'Cinderella',
    description: 'Cinderella is a dreamer who is trapped within a step-family who doesn\'t love or appreciate her. Enslaved by her evil stepmother and stepsisters, Cinderella dreams of going to the ball and meeting the Prince. With the help of a few mice friends and her fairy Godmother, Cinderella\'s dream comes true.',
    imgUrl: 'https://disneyprincess.fandom.com/wiki/Cinderella_(1950_film)?file=CinderellaDiamondEdition.jpg',
    year: '1950',
    genre:{
      gName:'Fantasy',
      gDescription: 'Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds'
  },
  director:{
    dName: 'Kenneth Charles Branagh',
    dBio: 'a British actor and filmmaker. Branagh trained at the Royal Academy of Dramatic Art in London and has served as its president since 2015',
    dYear: '1960 - '
  }
  },
  {
    title : 'Sleeping Beauty',
    description: 'When Maleficent curses Princess Aurora at birth, the three good fairies hide her, but one of the faintest hopes is that "with true love\'s kiss, the spell shall break." ',
    imgUrl: 'https://disneyprincess.fandom.com/wiki/Sleeping_Beauty?file=Sleeping-beauty.jpg',
    year: '1959',
    genre:{
      gName:'Animation',
      gDescription: 'An animated movie or cartoon, is made up of a series of slightly different drawings of people, animals, and objects that make them appear to move.' 
    },
  director:{
    dName: 'Wolfgang Reitherman',
    dBio: ' a German-American animator, director and producer and one of the "Nine Old Men" of core animators at Walt Disney Productions',
    dYear: '1909 - 1985'
  }
  },
  {
    title : 'The Little Mermaid',
    description: 'Ariel, a mermaid, wants desperately to be human so she can meet Prince Eric. After a sea witch helps her, she is human- but without a voice! And if Eric doesn\'t kiss her in three days, she will belong to evil Ursula- forever. ',
    imgUrl: 'https://disneyprincess.fandom.com/wiki/The_Little_Mermaid?file=Walt-Disney-Posters-The-Little-Mermaid-walt-disney-characters-34301569-1000-1458.jpg',
    year: '1989',
    genre:{
      gName:'Romance',
      gDescription: 'Romance films, romance movies, or ship films involve romantic love stories recorded in visual media for broadcast in theatres or on television that focus on passion, emotion, and the affectionate romantic involvement of the main characters'
  },
  director:{
    dName: 'John Edward Musker',
    dBio: 'an American animator, film director, screenwriter, and film producer',
    dYear: '1953 - '
  }
  },
  {
    title: 'Beauty and the Beast',
    description: 'After becoming prisoner to the Beast, Belle stays in the castle with his talking household objects. After she starts to fall for the beast, Belle must protect him and her from a jealous Gaston. ',
    imgUrl: 'https://disneyprincess.fandom.com/wiki/Beauty_and_the_Beast_(film)?file=Beauty_and_the_Beast_film_poster.jpg',
    year: '1991',
    genre:{
      gName:'Romance',
      gDescription: 'Romance films, romance movies, or ship films involve romantic love stories recorded in visual media for broadcast in theatres or on television that focus on passion, emotion, and the affectionate romantic involvement of the main characters'
  },
  director:{
    dName: 'Bill Condon',
    dBio: 'an American director and screenwriter. Condon is known for writing and/or directing numerous successful and acclaimed films',
    dYear: '1955 - '
  }
  },
  {
    title: 'Aladdin',
    description: 'Common thief Aladdin is cunned by Jafar into stealing a lamp from the Cave of Wonders that was home to an all powerful Genie, only to realize the Genie can help him win the heart of his true love Princess Jasmine. ',
    imgUrl: 'https://disneyprincess.fandom.com/wiki/Aladdin_(film)?file=Aladdin_poster_1992.jpg',
    year: '1992',
    genre:{
      gName:'Adventure',
      gDescription: 'Adventure film is a genre that revolves around the conquests and explorations of a protagonist.'
    },
  director:{
    dName: 'Ron Clements',
    dBio: 'American animator, film director, screenwriter, and film producer.',
    dYear: '1953 - '
  }
  },
  {
    title : 'Pocahontas ',
    description: 'John Smith and a crew of colonists meet a group of Natives, one of whom is the beautiful, daring Pocahontas. ',
    imgUrl: 'https://disneyprincess.fandom.com/wiki/Pocahontas_(film)?file=Pocehontas_poster.jpg',
    year: '1995',
    genre:{
      gName:'History',
      gDescription: 'A historical film is a fiction film showing past events or set within a historical period. '
  },
  director:{
    dName: 'Eric Allen Goldberg ',
    dBio: 'an American animator, voice actor and film director known for his work at both Walt Disney Animation Studios and Warner Bros. ',
    dYear: '1955 - '
  }
  },
  {
    title: 'Mulan',
    description: 'Tomboy Mulan secretely takes her father\'s place in the army of China to defeat the huns, lead by Shan Yu. ',
    imgUrl:'https://disneyprincess.fandom.com/wiki/Mulan_(1998_film)?file=51c9hJVDUCL._SX500_.jpg',
    year: '1998',
    genre:{
      gName:'Action',
      gDescription: 'a film with a fast-moving plot, usually containing scenes of violence.'
  },
  director:{
    dName: 'Tony Bancroft',
    dBio: 'an American animator and film director who frequently collaborates with Disney. He is the founder and owner of the faith-driven animation company Toonacious Family Entertainment.',
    dYear: '1967 - '
  }
  },
  {
    title : 'The Princess and the Frog',
    description: 'The movie opens with a bright star shining in the Louisiana sky. We hear the voice of Tiana singing, telling us that anything is possible if you wish upon the evening star. We are then taken to the very pink and frilly bedroom of young Charlotte La Bouff, who is sitting beside a young Tiana as they listen to Tiana\'s seamstress mother, Eudora tells the story of the Frog Prince as she puts the finishing touches on a dress for Charlotte. ',
    imgUrl: 'https://disneyprincess.fandom.com/wiki/The_Princess_and_the_Frog?file=The-Princess-And-The-Frog-poster.jpg',
    year: '2009',
    genre:{
      gName:'Comedy',
      gDescription: 'Comedy films are "make \'em laugh" films designed to elicit laughter from the audience.'
  },
  director:{
    dName: 'John Edward Musker',
    dBio: 'an American animator, film director, screenwriter, and film producer',
    dYear: '1953 - '
  }
  },
  {
    title : 'Tangled ',
    description:'An elderly woman named Gothel witnesses a single drop of sunlight hit the ground, creating a magical flower with the ability to keep herself young when she sings to it. Centuries later, the queen of a large kingdom falls ill while expecting a child. Her guards located the mysterious flower, hidden by Gothel, and bring it to the queen. The flower heals the queen and she gives birth to a girl named Rapunzel, who comes to inherit the flower\'s magic through her long golden hair. One night, Gothel kidnaps Rapunzel and isolates her in a tower as her own daughter. However, every year on her birthday, the kingdom sends floating lanterns into the sky, longing for their princess to return. ',
    imgUrl: 'https://disneyprincess.fandom.com/wiki/Tangled?file=Tangled_rapunzel_poster_20.jpg',
    year: '2010',
    genre:{
      gName:'Adventure',
      gDescription: 'Adventure film is a genre that revolves around the conquests and explorations of a protagonist.'
    },
  director:{
    dName: 'Nathan Greno',
    dBio: ' an American film director, story artist, and writer best known as the co-director of the 2010 animated film Tangled',
    dYear: '1975 - '
  }
  },
  {
    title : 'Brave',
    description: 'All Princess Merida wants to do is ride off on Angus, her horse, shoot her bow and be as wild and free as her fiery red hair. However, her mother Elinor has entirely different ideas. After it goes too far and Merida defies an ancient custom, she decides to change her fate... which leads to a terrifying adventure. ',
    imgUrl: 'https://disneyprincess.fandom.com/wiki/Brave?file=Brave_Movie_Poster.jpg',
    year: '2012',
    genre:{
      gName:'Pretty scary',
      gDescription: ' A movie that triggers horror or fear in those that watch it'
  },
  director:{
    dName: 'Mark Andrews',
    dBio: 'an American film director, screenwriter, animator, he is best known for the 2012 Pixar feature film Brave.',
    dYear: '1968 - '
  }
  },
  {
    title : 'Frozen',
    description: 'When their kingdom becomes trapped in perpetual winter, fearless Anna (Kristen Bell) joins forces with mountaineer Kristoff (Jonathan Groff) and his reindeer sidekick to find Anna\'s sister, Snow Queen Elsa (Idina Menzel), and break her icy spell. Although their epic journey leads them to encounters with mystical trolls, a comedic snowman (Josh Gad), harsh conditions, and magic at every turn, Anna and Kristoff bravely push onward in a race to save their kingdom from winter\'s cold grip.',
    imgUrl: 'https://disneyprincess.fandom.com/wiki/List_of_Disney_Princess_Films?file=Frozen.jpg#Snow_White_and_the_Seven_Dwarfs',
    year: '2013',
    genre:{
      gName:'Adventure',
      gDescription: 'Adventure film is a genre that revolves around the conquests and explorations of a protagonist.'
    },
  director:{
    dName: 'Jennifer Michelle Lee',
    dBio: 'an American screenwriter, film director, and chief creative officer of Walt Disney Animation Studios.',
    dYear: '1971 - '
  }
  },
  {
    title : 'Moana',
    description: 'An adventurous teenager sails out on a daring mission to save her people. During her journey, Moana meets the once-mighty demigod Maui, who guides her in her quest to become a master way-finder. Together they sail across the open ocean on an action-packed voyage, encountering enormous monsters and impossible odds. Along the way, Moana fulfills the ancient quest of her ancestors and discovers the one thing she always sought: her own identity.',
    imgUrl: 'https://disneyprincess.fandom.com/wiki/List_of_Disney_Princess_Films?file=Moana_official_poster.jpg#Disney_Princess_Films',
    year: '2016',
    genre:{
    gName:'Action',
    gDescription: 'a film with a fast-moving plot, usually containing scenes of violence.'
  },
  director:{
    dName: 'Ron Clements',
    dBio: 'American animator, film director, screenwriter, and film producer.',
    dYear: '1953 - '
  }
  },
  {
    title : 'Frozen II ',
    description: 'Elsa the Snow Queen has an extraordinary gift -- the power to create ice and snow. But no matter how happy she is to be surrounded by the people of Arendelle, Elsa finds herself strangely unsettled. After hearing a mysterious voice call out to her, Elsa travels to the enchanted forests and dark seas beyond her kingdom -- an adventure that soon turns into a journey of self-discovery.',
    imgUrl:'https://disneyprincess.fandom.com/wiki/List_of_Disney_Princess_Films?file=Frozen_2_Official_Poster.jpg#Disney_Princess_Films',
    year: '2019',
    genre:{
      gName:'Adventure',
      gDescription: 'Adventure film is a genre that revolves around the conquests and explorations of a protagonist.'
    },
  director:{
    dName: 'Jennifer Michelle Lee',
    dBio: 'an American screenwriter, film director, and chief creative officer of Walt Disney Animation Studios.',
    dYear: '1971 - '
  }
  },
  {
    title : 'Raya and the Last Dragon',
    description: 'Raya, a warrior, sets out to track down Sisu, a dragon, who transferred all her powers into a magical gem which is now scattered all over the kingdom of Kumandra, dividing its people.',
    imgUrl: 'https://disneyprincess.fandom.com/wiki/List_of_Disney_Princess_Films?file=4d63b0e799889e19cad9e2d9a600a72c.jpg#Disney_Princess_Films',
    year: '2021',
    genre:{
      gName:'Action',
      gDescription: 'a film with a fast-moving plot, usually containing scenes of violence.'
    },
  director:{
    dName: 'Carlos López Estrada',
    dBio: 'a Mexican-American Academy Award-nominated filmmaker, music video director, commercial director, theatre director, and actor.',
    dYear: '1988 - '
  }
  }];

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flag: 'a'})
app.use(morgan('common', { stream: accessLogStream }));
app.use('/documentation',express.static('Public'));

// GET Method
// GET request (Read from server)- Home page
app.get('/', (req, res)=>{
  res.send('Welcome to Disney Pricess movies list!\n');
});
// GET all movies
app.get('/movies', (req,res)=>{
  res.json(disneyMovies);
});
// GET all users
app.get('/appUsers', (req,res)=>{
  res.json(appUsers);
});
// GET movies by name
app.get('/movies/:title', (req,res)=>{
const title = req.params.title;
const movie = disneyMovies.find(movie =>movie.title === title);
if(movie){
res.json(movie).status(200);
}
else{
res.send("Cannot find movie").status(400);
}
})
// GET movies by genre
app.get('/movies/genre/:gName', (req,res)=>{
  const genName = req.params.gName;
  const genre = disneyMovies.find(movie =>movie.genre.gName === genName).genre;
  if(genre){
  res.json(genre).status(200);
  }
  else{
  res.send("Cannot find the genre").status(400);
  }
  })
// GET movies by director
app.get('/movies/director/:dName', (req,res)=>{
  const dirName = req.params.dName;
  const director = disneyMovies.find(movie =>movie.director.dName === dirName).director;
  if(director){
  res.json(director).status(200);
  }
  else{
  res.send("No such director").status(400);
  }
  })

// POST Method
// Create new user 
app.post('/appusers', (req, res) => {
  let newUsers = req.body;

  if (!newUsers.name) {
    const message = 'Missing "name" in request body';
    res.status(400).send(message);
  } else {
    newUsers.id = uuid.v4();
    appUsers.push(newUsers);
    res.status(201).send(newUsers);
  }
}); 
// Adding favorite movies
app.post('/appusers/:id/:favMovieTitles',(req,res)=>{
  const{id , favMovieTitles} = req.params;
  let user=appUsers.find(user=>user.id ==id);
  
  if(user){
    user.favMovies.push(favMovieTitles);
    res.send(`${favMovieTitles} has been added to user`).status(201);
  }else{
    res.send(`${favMovieTitles} has not added to the list`).status(400);
  }
})

// PUT Method
//updating the user name
app.put('/appusers/:id', (req,res)=>{
  const { id } = req.params;
  const updatedUser = req.body;
  let user = appUsers.find(user=>user.id == id);
  if(user){
   user.name = updatedUser.name;
   console.log(user.name);
   res.json(appUsers).status(200);
  }else{
    res.send('Cannot update user info').status(400);
  }
})

// DELETE Method
// Deleting the movies from the favorite list
app.delete('/appusers/:id/:favMovieTitles',(req,res)=>{
  const{id , favMovieTitles} = req.params;
  let user=appUsers.find(user=>user.id ==id);
  if(user){
    user.favMovies= user.favMovies.filter(title => title!== favMovieTitles);
    res.send(`${favMovieTitles} has been removed from the user list`).status(201);
  }else{
    res.send('User not found').status(400);
  }
})
// Allow user to de-register
app.delete('/appusers/:id',(req,res)=>{
  const{id} = req.params;
  let user=appUsers.find(user=>user.id ==id);
  if(user){
    let a = user.name;
    console.log(a);
    user.name= appUsers.filter(user => user.id!== id);
    res.send(`${a} has been removed from the user list`).status(201);
  }else{
    res.send('User not found').status(400);
  }
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).send('Something broke!');
});
// Listen 
app.listen(8080,()=>{
  console.log('My first Node test server is running on Port 8080');
})
