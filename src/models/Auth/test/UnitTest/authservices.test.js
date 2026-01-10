const AuthRepositories = require('../../Auth.repositories')
const bcryptService = require('../../../../utils/bcrypt')
const AuthServices = require('../../Auth.services')
const jwtServices = require('../../../../utils/jwt')

jest.mock('../../Auth.repositories')
jest.mock('../../../../utils/jwt')
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


describe('Testing the login service',()=>{
    test('Should throw error if email is not defined', async()=>{
        const data ={password:"Test@m.com"}
        await expect(AuthServices.login(data)).rejects.toThrow('email is required')
        
    })
    test('Should throw error if password is not defined', async()=>{
        const data ={email:"Test@m.com"}
        await expect(AuthServices.login(data)).rejects.toThrow('password is required')
        
    })
    test('Should throw error if user not exist', async()=>{
        const data ={email:"Test@m.com",password:"TestPassword"}
        AuthRepositories.findbyemail.mockResolvedValue(null)
        await expect(AuthServices.login(data)).rejects.toThrow('User not found')
        
    })
    test('Should throw error if password not matched', async()=>{
        const data ={email:"Test@m.com",password:"TestPassword"}
        AuthRepositories.findbyemail.mockResolvedValue(true)
        bcryptService.comparePassword.mockResolvedValue(false)
        await expect(AuthServices.login(data)).rejects.toThrow('Password not matched')
    })

    test('Should throw error if AccessToken is not generated',async()=>{
          const data ={email:"Test@m.com",password:"TestPassword"}
        AuthRepositories.findbyemail.mockResolvedValue(true)
        bcryptService.comparePassword.mockResolvedValue(true)
        jwtServices.generateAccessToken.mockResolvedValue(false)
        await expect(AuthServices.login(data)).rejects.toThrow('Access token is not generated')
    })
    test('Should throw error if RefreshToken is not generated',async()=>{
          const data ={email:"Test@m.com",password:"TestPassword"}
        AuthRepositories.findbyemail.mockResolvedValue(true)
        bcryptService.comparePassword.mockResolvedValue(true)
        jwtServices.generateAccessToken.mockResolvedValue(true)
        jwtServices.generateRefreshToken.mockResolvedValue(false)
        await expect(AuthServices.login(data)).rejects.toThrow('Refresh token is not generated')
    })

    test('User Successfully login',async()=>{
          const data ={email:"Test@m.com",password:"TestPassword"}
        AuthRepositories.findbyemail.mockResolvedValue({name:"name",id:1,role:"member"})
        bcryptService.comparePassword.mockResolvedValue(true)
        jwtServices.generateAccessToken.mockResolvedValue("AccessToken")
        jwtServices.generateRefreshToken.mockResolvedValue("RefreshToken")
        const result = await AuthServices.login(data)
        expect(AuthRepositories.findbyemail).toHaveBeenCalledWith("Test@m.com")
        expect(jwtServices.generateAccessToken).toHaveBeenCalledWith({id:1,role:"member",name:"name"})
        expect(jwtServices.generateRefreshToken).toHaveBeenCalledWith({id:1,role:"member",name:"name"})
        expect(result.name).toBe("name")
        expect(result.AccessToken).toBe("AccessToken")
        expect(result.RefreshToken).toBe("RefreshToken")
    })

    
})

describe("Testing the logout service",()=>{
    test("User should logout successufully",async()=>{
        const refreshToken = "RefreshToken";

        jwtServices.decodeRefreshToken.mockResolvedValue({id:"1"})
        AuthRepositories.findbyid.mockResolvedValue({id:"1",refreshToken:"RefreshToken"})
        bcryptService.compareToken.mockResolvedValue(true)
        AuthRepositories.updateRefreshToken.mockResolvedValue(1)

        const result = await AuthServices.logout(refreshToken);

        expect(result.message).toBe("done")
    })

    test("should throw error if decode not happen",async()=>{
        const refreshToken = "RefreshToken";
        jwtServices.decodeRefreshToken.mockResolvedValue(false)
        await expect(AuthServices.logout(refreshToken)).rejects.toThrow('Decode does not work')
    })

    test("should throw error if verification fails",async()=>{
        const refreshToken = "RefreshToken";

        jwtServices.decodeRefreshToken.mockResolvedValue({id:"1"})
        AuthRepositories.findbyid.mockResolvedValue({id:"1",refreshToken:"RefreshToken"})
        bcryptService.compareToken.mockResolvedValue(false)
        await expect(AuthServices.logout(refreshToken)).rejects.toThrow('Permission denied')
    })
    
     test("should throw error when token is not updated",async()=>{
        const refreshToken = "RefreshToken";

        jwtServices.decodeRefreshToken.mockResolvedValue({id:"1"})
        AuthRepositories.findbyid.mockResolvedValue({id:"1",refreshToken:"RefreshToken"})
        bcryptService.compareToken.mockResolvedValue(true)
        AuthRepositories.updateRefreshToken.mockResolvedValue(0)
        await expect(AuthServices.logout(refreshToken)).rejects.toThrow('token is not updated')
    })
   

})

