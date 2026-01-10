

const AuthQueries = {
 createuser: `INSERT INTO users(name,email,password)VALUES($1,$2,$3) RETURNING *`,
 findbyemail:`SELECT * FROM users WHERE email = $1`,
 saveRefreshToken:`UPDATE users SET refreshtoken = $1 WHERE id = $2`
}

module.exports = AuthQueries