const AuthRepositories = require('../../Auth.repositories')
const bcryptService = require('../../../../utils/bcrypt')
const AuthServices = require('../../Auth.services')

jest.mock('../../Auth.repositories')
jest.mock('../../../../utils/bcrypt')

describe('Testing the registration service',()=>{
    
    test('Should throw error if name is missing', async()=>{
        const data = {email:"test@m",password:"testPwd"};

        await expect(AuthServices.register(data)).rejects.toThrow('Name is not defined')
    })
    test('Should throw error if email is missing', async()=>{
        const data = {name:"testname",password:"testPwd"};

        await expect(AuthServices.register(data)).rejects.toThrow('Email is not defined')
    })
    test('Should throw error if password is missing', async()=>{
        const data = {email:"test@m",name:"testname"};

        await expect(AuthServices.register(data)).rejects.toThrow('Password is not defined')
    })

    test('Should throw error if Email is existed',async()=>{
        const data = {name:"testname",email:'test@m',password:'testpassword'}

        AuthRepositories.findbyemail.mockResolvedValue(true)

        await expect(AuthServices.register(data)).rejects.toThrow('Email is already existed')
        
    })

      test('Should throw error if password is not hashed ',async()=>{
          const data = {name:"testname",email:'test@m',password:'testpassword'}
            AuthRepositories.findbyemail.mockResolvedValue(null)
            bcryptService.hashPassword.mockResolvedValue(false)

            await expect(AuthServices.register(data)).rejects.toThrow('Password is not hashed')
    })

    test('Should throw error if user is not created', async () => {
  const data = { name: "test", email: "test@m", password: "pass" };

  AuthRepositories.findbyemail.mockResolvedValue(null);
  bcryptService.hashPassword.mockResolvedValue("hashedpass");

  // simulate DB failure
  AuthRepositories.createuser.mockResolvedValue(null);

  await expect(AuthServices.register(data))
    .rejects
    .toThrow("user is not created");
});



    test('User should register successfully',async()=>{
        const data = {name:"testname",email:'test@m',password:'testpassword'}
        AuthRepositories.findbyemail.mockResolvedValue(null)
        bcryptService.hashPassword.mockResolvedValue('hashtestpassword')
        AuthRepositories.createuser.mockResolvedValue({id:1,name:"testname",email:'test@m',password:'hashtestpassword'})

        const result = await AuthServices.register(data)

        expect(bcryptService.hashPassword).toHaveBeenCalledWith('testpassword')
        expect(AuthRepositories.createuser).toHaveBeenCalled()
        expect(result.message).toBe('User Registered successfully')
    })

  
















})

