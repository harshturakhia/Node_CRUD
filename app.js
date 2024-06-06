require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');

//DEFAULT
const PORT = process.env.PORT || 3000; // Ensure a default port if PORT is not set

//IMPORTS 
const routes = require('./routes/routes');

//MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: 'My secret key',
  saveUninitialized: true,
  resave: false,
}));

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
})

// Use routes
app.use(routes);
app.use(express.static('uploads'))

//TEMPLATE ENGINE
app.set('view engine', 'ejs');


//DATABASE CONNECTION
mongoose.connect(process.env.URI)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log(err);
  });


//SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
