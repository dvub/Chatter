const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('./db_query')
router.get('/', checkAuthenticated, (req, res) => {
    res.render('index.html')
  })
  
  //render login page if user is not authenticated
  router.get('/login',  checkNotAuthenticated, (req, res) => {
    res.render('login.html')
  
  })
  //render registration page if user isn't authenticated
  router.get('/register',checkNotAuthenticated, (req, res) => {
    res.render('register.html')
  })
  
  //when the user logs in, the post method is used, running this code
  router.post('/login', checkNotAuthenticated, passport.authenticate('local'), function(req, res) {
    //create jwt token which will be used with socketio
    var token = jwt.sign({
      data: {
        id: req.user.id,
        username: req.user.username
      }
    }, 'secret', {expiresIn: '1h'})
    res.cookie('user', token, { maxAge: 900000, httpOnly: false })
    res.redirect('/')
  
  
  })
  
  router.post('/register',checkNotAuthenticated, async (req, res) => {
    try {
      const reqEmail = req.body.email
      const reqName = req.body.name
      const reqPwd = req.body.password
      //if a user already exists, don't create a new account
      
        var user = await db.checkUserExists(reqEmail, reqName)
        if (user) {
          console.log('a user already exists!')
          res.redirect('/register') 
          return
        }
  
        //otherwise, create a new account
        const hashedPassword = await bcrypt.hash(reqPwd, 10)
        await db.createNewUser(reqEmail, reqName, hashedPassword)
  
        res.redirect('/login')
    } catch {
  
        res.redirect('/register')
    }
  })
  
  //logout function and redirect user
  router.delete('/logout', (req, res) => {
    req.logOut()
  
    res.redirect('/login')
  })
  //functions to check if user is authenticated using passport.js
function checkAuthenticated(req, res, next) {

    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
  
    if (req.isAuthenticated()) {
    
      return res.redirect('/')
    }
    next()
  }
module.exports = router