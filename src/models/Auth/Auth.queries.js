

const AuthQueries = {
 createuser: `INSERT INTO users(name,email,password)VALUES($1,$2,$3) RETURNING *`,
 findbyemail:`SELECT * FROM users WHERE email = $1`,
 updateRefreshToken:`UPDATE users SET refreshtoken = $1 WHERE id = $2`,
 findbyid:"SELECT * FROM users WHERE id = $1"
}

module.exports = AuthQueries