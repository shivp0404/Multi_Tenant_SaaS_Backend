const tenantService = require("../../tenantService");
const tenantRepositories = require("../../tenantRepositories");
const jwtServices = require("../../../../utils/jwt");
const pool = require("../..//../../../config/db");

jest.mock("../../tenantRepositories");
jest.mock("../../../../utils/jwt");
jest.mock("../../../../../config/db");

describe("tenantService.tenantRegister", () => {
  let client;

  beforeEach(() => {
    client = {
      query: jest.fn(),
      release: jest.fn(),
    };

    pool.connect.mockResolvedValue(client);
    client.query.mockResolvedValue(); // for BEGIN / COMMIT
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create tenant, roles, membership and return token", async () => {
    tenantRepositories.createTenant.mockResolvedValue(10);
    tenantRepositories.assignRole
      .mockResolvedValueOnce(1) // Admin
      .mockResolvedValueOnce(2) // Manager
      .mockResolvedValueOnce(3); // Member

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

    expect(result.accessToken).toBe("jwt-token");
  });

  it("should rollback if role creation fails", async () => {
    tenantRepositories.createTenant.mockResolvedValue(10);
    tenantRepositories.assignRole
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(null); // Manager fails

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
