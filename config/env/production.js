module.exports = {
  env: 'production',
  db: process.env.MONGODB_URI,
  port: process.env.PORT,
  debug: false,
  address: 'https://odontoquiz.herokuapp.com',
  domain: 'https://odontoquiz.herokuapp.com',
  jwtSecret: process.env.JWT_SECRET,
  jwtSession: {session: false},
}