const request = require('supertest');
const app = require('../../../../../app');
const pool = require('../../../../../config/db');

describe('Integration: User Registration', () => {

  beforeEach(async () => {
    // Clean users table before each test
    await pool.query('DELETE FROM users');
  });

  afterAll(async () => {
    await pool.end(); // close DB connection
  });

  test('POST /auth/register should create user successfully', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        name: 'test',
        email: 'test@mail.com',
        password: 'TestPass123'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User Registered successfully');

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['test@mail.com']
    );

    expect(result.rowCount).toBe(1);

  
    expect(result.rows[0].password).not.toBe('TestPass123');
  });

  test('POST /auth/register should fail for missing password', async () => {
  const response = await request(app)
    .post('/auth/register')
    .send({
      name: 'test',
      email: 'test@mail.com'
    });

  expect(response.status).toBe(500);
  expect(response.body.Error).toBe('Password is not defined');
});


});
