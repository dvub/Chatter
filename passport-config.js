const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const db = require('./db_query')

//main function used for initializing passport
async function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const user = await db.findUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }
    //bcrypt compares passwords
    try {
      if (await bcrypt.compare(password, user[0][0].password)) {
        return done(null, user[0][0])
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser(async function (user, done) {
    await done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    return await done(null, db.findUserById(id))
  })
}

module.exports = initialize