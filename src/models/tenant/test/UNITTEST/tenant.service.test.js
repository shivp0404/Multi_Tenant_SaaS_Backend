const tenantService = require("../../tenantService");
const tenantRepositories = require("../../tenantRepositories");
const jwtServices = require("../../../../utils/jwt");
const pool = require("../..//../../../config/db");
const AuthRepositories = require("../../../Auth/Auth.repositories")

jest.mock("../../tenantRepositories");
jest.mock("../../../../utils/jwt");
jest.mock("../../../../../config/db");
jest.mock("../../../Auth/Auth.repositories")

describe("Unit Test for tenant service Registration", () => {
  let client;

  beforeEach(() => {
    client = {
      query: jest.fn(),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(client);
    client.query.mockResolvedValue(); 
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create tenant, roles, membership and return token", async () => {
    tenantRepositories.createTenant.mockResolvedValue(10);
    tenantRepositories.assignRole
      .mockResolvedValueOnce(1) 
      .mockResolvedValueOnce(2) 
      .mockResolvedValueOnce(3); 

    tenantRepositories.membership.mockResolvedValue({ id: 99 });

    jwtServices.generateAccessToken.mockResolvedValue("jwt-token");

    const result = await tenantService.tenantRegister(5, "My Company");

    expect(pool.connect).toHaveBeenCalled();
    expect(client.query).toHaveBeenCalledWith("BEGIN");

    expect(tenantRepositories.createTenant)
      .toHaveBeenCalledWith(client, "My Company", 5);

    expect(tenantRepositories.assignRole).toHaveBeenCalledTimes(3);

    expect(tenantRepositories.membership)
      .toHaveBeenCalledWith(client, 5, 10, 1, "active");

    expect(client.query).toHaveBeenCalledWith("COMMIT");
    expect(client.release).toHaveBeenCalled();

    expect(result.tenantId).toBe(10)
    expect(result.AccessToken).toBe("jwt-token");
  });

  it("should rollback if role creation fails", async () => {
    tenantRepositories.createTenant.mockResolvedValue(10);
    tenantRepositories.assignRole
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(null); 

    await expect(
      tenantService.tenantRegister(5, "Broken Company")
    ).rejects.toThrow();

    expect(client.query).toHaveBeenCalledWith("BEGIN");
    expect(client.query).toHaveBeenCalledWith("ROLLBACK");
    expect(client.release).toHaveBeenCalled();
  });

  it("should rollback if membership creation fails", async () => {
    tenantRepositories.createTenant.mockResolvedValue(10);
    tenantRepositories.assignRole
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(3);

    tenantRepositories.membership.mockResolvedValue(null);

    await expect(
      tenantService.tenantRegister(5, "No Member Corp")
    ).rejects.toThrow("Membership creation failed");

    expect(client.query).toHaveBeenCalledWith("ROLLBACK");
  });

  it("should reject empty tenant name", async () => {
    await expect(
      tenantService.tenantRegister(5, "")
    ).rejects.toThrow("Tenant name is required");


  });

  it("should reject missing userId", async () => {
    await expect(
      tenantService.tenantRegister(null, "Acme")
    ).rejects.toThrow("User id missing");

  });
});

describe("Unit TEST for fetching all tenant",()=>{
 it("Should throw error when id is not recieved",async()=>{
   const payload = null;
   await expect(tenantService.mytenants(payload)).rejects.toThrow("Id didn't Recieved")})



it("User should fetch tenant successfully", async () => {
  const payload = 1;

  const mockTenants = [{ tenant1: 1, tenant2: 2 }];

  tenantRepositories.mytenants.mockResolvedValue(mockTenants);

  const result = await tenantService.mytenants(payload);

  expect(result).toEqual(mockTenants);
});

it("Should return empty array when user has no tenants", async () => {
  tenantRepositories.mytenants.mockResolvedValue([]);

  const result = await tenantService.mytenants(1);

  expect(result).toEqual([]);
});



})

describe("Unit test for inviting a user",()=>{
  test("Should throw error if user not found",async()=>{
    AuthRepositories.findbyemail.mockResolvedValue(false)
    await expect(tenantService.inviteUser("1","test@g.com","Admin")).rejects.toThrow("User not found");
  })
  test("Should throw error if role id is not defined found ",async()=>{
    AuthRepositories.findbyemail.mockResolvedValue(true);
    tenantRepositories.findbyrole.mockResolvedValue(false);
    await expect(tenantService.inviteUser('1',"Test@g.com","Admin")).rejects.toThrow("Role not found");
  })
  
  test("Invitation send successfully",async()=>{
    AuthRepositories.findbyemail.mockResolvedValue({id:"1"})
    tenantRepositories.findbyrole.mockResolvedValue("45737829");
    tenantRepositories.inviteUser.mockResolvedValue("ld39023kd");
    const result = await tenantService.inviteUser("1","Test@g.com","Admin")
    expect(result).toBe("ld39023kd")
  })

})

describe("Unit test for to see all invitation",()=>{
    test("Should throw error if id not found",async()=>{
    await expect(tenantService.allinvitation(null)).rejects.toThrow("Id not found");
  })
   test("Invitation Fetch Successfuly",async()=>{
    tenantRepositories.getInvitation.mockResolvedValue([{id:1}])
    const result = await tenantService.allinvitation("1",)
    expect(result).toEqual([{id:1}])
  })
})
