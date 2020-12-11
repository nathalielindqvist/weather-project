if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  // Require necessary packages
  const express = require('express')
  const app = express()
  const bcrypt = require('bcryptjs')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')

  // Initialize Passport.js for login inputs
  const initializePassport = require('./passport-config')
  initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  
  // Array for storing users
  const users = []

  // Set packages in use
  app.set('view-engine', 'ejs')
  app.use(express.urlencoded({ extended: false }))
  app.use('/public', express.static(__dirname + '/public' ));
  app.use(flash())
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,    
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  
  // GET request for index file
  app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
  })
  
  // GET for login file
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })
  
  // POST request for login file
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
  // GET request for register file
  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })
  
  // POST request for register file, including password encryption
  app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  })
  
  // DELETE request, for logout
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  // Check if user is authenticated
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  // Check if user is not authenticated
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  
  // Listen to port 3000
  app.listen(3000)