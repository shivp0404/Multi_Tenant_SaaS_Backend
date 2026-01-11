const request = require('supertest');
const app = require('../../../../../app');
const pool = require('../../../../../config/db');


describe('Integration: User Registration', () => {

  beforeEach(async () => {
  
    await pool.query('DELETE FROM users');
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

describe('IntegrationTest: User login', () => {

  beforeEach(async () => {
  
    await pool.query('DELETE FROM users');
  });

  test('POST /auth/login should login user successfully', async () => {

    const user = await request(app).post('/auth/register').send({
        name: 'test',
        email: 'test@mail.com',
        password: 'TestPass123'
      })

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@mail.com',
        password: 'TestPass123'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login Successfull');
    expect(response.body.data.name).toBe('test');
    expect(response.body.data.accesstoken).toBeDefined()
    

  });

  test('POST /auth/login should give error if email does not exist', async () => {

    const user = await request(app).post('/auth/register').send({
        name: 'test',
        email: 'tese@mail.com',
        password: 'TestPass123'
      })

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@mail.com',
        password: 'TestPass123'
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  
    

  });


});


describe("Intergration test for logout",()=>{
   beforeEach(async () => {
  
    await pool.query('DELETE FROM users');
  });


  test("User Should logout successfully",async()=>{
    const agent = request.agent(app)
      const user = await agent.post('/auth/register').send({
        name: 'test',
        email: 'test@mail.com',
        password: 'TestPass123'
      })

    const login = await agent
      .post('/auth/login')
      .send({
        email: 'test@mail.com',
        password: 'TestPass123'
      });

     const logout = await agent.post('/auth/logout')
      
     expect(logout.status).toBe(200)
     expect(logout.body.message).toBe('done')

    
  })

  test("Should throw error if cookie doesn't recieved",async()=>{
    const agent = request.agent(app)
      const user = await agent.post('/auth/register').send({
        name: 'test',
        email: 'test@mail.com',
        password: 'TestPass123'
      })

    const login = await agent
      .post('/auth/login')
      .send({
        email: 'test@mail.com',
        password: 'TestPass123'
      });

     const logout = await request(app).post('/auth/logout')
      
     expect(logout.status).toBe(400)
     expect(logout.body.message).toBe("RefreshToken not found")
  })
})

describe("Intergration test for refresh",()=>{
   beforeEach(async () => {
  
    await pool.query('DELETE FROM users');
  });
    afterAll(async () => {
    await pool.end(); 
  });

  test("User Should refresh successfully",async()=>{
    const agent = request.agent(app)
      const user = await agent.post('/auth/register').send({
        name: 'test',
        email: 'test@mail.com',
        password: 'TestPass123'
      })

    const login = await agent
      .post('/auth/login')
      .send({
        email: 'test@mail.com',
        password: 'TestPass123'
      });

     const response = await agent.post('/auth/refresh')
      
     expect(response.status).toBe(200)
     expect(response.body.success).toBe(true)
     expect(response.body.message).toBe("Refresh Successfull")
     expect(response.body.data.accesstoken).toBeDefined()

    
  })

  test("Should throw error if cookie doesn't recieved",async()=>{
    const agent = request.agent(app)
      const user = await agent.post('/auth/register').send({
        name: 'test',
        email: 'test@mail.com',
        password: 'TestPass123'
      })

    const login = await agent
      .post('/auth/login')
      .send({
        email: 'test@mail.com',
        password: 'TestPass123'
      });

     const response = await request(app).post('/auth/refresh')
      
     expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
     expect(response.body.message).toBe("Token not recieved")
  })
})
