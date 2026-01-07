

const AuthQueries = {
 createuser: `INSERT INTO users(name,email,password)VALUES($1,$2,$3)`,
 findbyemail:`SELECT * FROM users WHERE email = $1`,
}

module.exports = AuthQueries