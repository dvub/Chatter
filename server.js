if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const session = require('express-session'),
  express = require('express'),
  app = express(),
  passport = require('passport'),
  httpServer = require('http').createServer(app),
  io = require("socket.io")(httpServer),
  flash = require('express-flash'),
  methodOverride = require('method-override'),
  engine = require('consolidate'),
  cors = require('cors'),
  morgan  = require('morgan'),
  db = require('./db_query'),
  initializePassport = require('./passport-config'),
  routing = require('./routing'),
  socketio_auth = require('socketio-auth'),
  socket_authentication = require('./socket-authentication')
main()
async function main() {
  await db.connect()
  console.log(await db.getUserFriendRequests(3))
  await db.denyFriendRequest(4, 3)
  console.log(await db.getFriendsOfUser(3))
}

initializePassport(passport)

socketio_auth(io, {
  authenticate: socket_authentication.authenticate,
  postAuthenticate: socket_authentication.postAuthenticate,
  disconnect: socket_authentication.disconnect
})

app.use(morgan('combined'))
app.use(
  cors({
    origin: '*'
  })
)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
  }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.set('views', __dirname + '/views');
app.engine('html', engine.mustache);
app.set('view engine', 'html');
app.use('/', routing)
app.use(express.static('views'))

httpServer.listen(3000);