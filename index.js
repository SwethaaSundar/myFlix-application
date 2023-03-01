const express = require('express');
const app = express();
const morgan = require('morgan');

let topMovies = [
  {
    movies : 'Snow White and the 7 Dwarfs',
    year: '1937'
  },
  {
    movies : 'Cinderella ',
    year: '1950'
  },
  {
    movies : 'Sleeping Beauty',
    year: '1959'
  },
  {
    movies : 'The Little Mermaid',
    year: '1989'
  },
  {
    movies : 'Beauty and the Beast',
    year: '1991'
  },
  {
    movies : 'Aladdin',
    year: '1992'
  },
  {
    movies : 'Pocahontas ',
    year: '1995'
  },
  {
    movies : 'Mulan',
    year: '1998'
  },
  {
    movies : 'The Princess and the Frog',
    year: '2009'
  },
  {
    movies : 'Tangled ',
    year: '2010'
  },
  {
    movies : 'Brave',
    year: '2012'
  },
  {
    movies : 'Frozen',
    year: '2013'
  },
  {
    movies : 'Moana',
    year: '2016'
  },
  {
    movies : 'Frozen II ',
    year: '2019'
  },
  {
    movies : 'Raya and the Last Dragon',
    year: '2021'
  }];

app.use(morgan('common'));
app.use('/documentation',express.static('Public'));
// GET request
app.get('/', (req, res)=>{
  res.send('Welcome to Disney Pricess movies list!\n');
});
app.get('/secret', (req, res)=>{ 
  res.send('Secret!');
});
app.get('/movies', (req,res)=>{
  res.json(topMovies);
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
