const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')
const fs = require('fs')

//IMPORTS
const User = require('../models/users')


//IMAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
  }
})

var upload = multer({
  storage: storage,
}).single("image")


// GET - Display all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().exec();
    res.render('index', { title: "Home Page", users: users });
  } catch (err) {
    res.json({ message: err.message });
  }
})

// GET - Add User
router.get('/add', (req, res) => {
  res.render('add_user', { title: "Add User" })
})

// POST - Add User
router.post('/add', upload, async (req, res) => {
  const { name, email, phone } = req.body;
  const image = req.file ? req.file.filename : '';

  // Validate required fields
  if (!name || !email || !phone || !image) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = new User({
      name: name,
      email: email,
      phone: phone,
      image: image
    });

    await user.save();

    req.session.message = {
      type: 'success',
      message: 'User added successfully'
    };

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

})


// GET - Update User
router.get('/edit/:id', (req, res) => {

  let id = req.params.id;

  User.findById(id)
    .then(user => {
      if (user == null) {
        res.redirect('/')
      }
      else {
        res.render('edit_user', {
          user: user,
          title: "Edit"
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
})

//POST - Update User
router.post('/update/:id', upload, (req, res) => {

  let id = req.params.id;
  let newImage = '';

  if (req.file) {
    newImage = req.file.filename;

    try {
      fs.unlinkSync('./uploads/' + req.body.old_image);
    }
    catch (err) {
      console.log(err.message)
    }
  }
  else {
    newImage = req.body.old_image;
  }

  User.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: newImage // Use the newImage variable here
  })
    .then(() => {
      req.session.message = {
        type: 'success',
        message: "User updated successfully"
      };
      res.redirect('/');

    })
    .catch((err) => {
      console.log(err.message)
    })

})



//POST - Delete User
router.get('/delete/:id', upload, (req, res) => {

  let id = req.params.id;

  User.findByIdAndDelete(id)
    .then((deletedItem) => {
      if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      // Successfully deleted the item
      req.session.message = {
        type: 'success',
        message: "User updated successfully"
      };
      res.redirect('/');
    })
    .catch((error) => {
      console.error(error);
    });

})
module.exports = router;