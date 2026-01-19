const BusinessService = require('../../Business.service');
const BusinessRepository = require('../../Business.repositories');
const AuthRepository = require('../../../Auth/Auth.repositories');

jest.mock('../../Business.repositories');
jest.mock('../../../Auth/Auth.repositories');

describe('BusinessService.createTask (service-based tests)', () => {
  const tenantId = 'tenant-1';
  const userId = 'creator-1';

  const validData = {
    email: 'assigned@test.com',
    title: 'Test Task',
    description: 'Task description',
    status: 'OPEN',
    priority: 'HIGH'
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SUCCESS CASE', () => {
    it('should return created task when all inputs are valid', async () => {
      // Arrange (service dependencies)
      AuthRepository.findbyemail.mockResolvedValue({ id: 'user-2' });
      BusinessRepository.validateAssignUser.mockResolvedValue(true);
      BusinessRepository.createTask.mockResolvedValue({
        id: 'task-1',
        title: validData.title
      });

      // Act
      const result = await BusinessService.createTask(
        tenantId,
        userId,
        validData
      );

      // Assert (service outcome)
      expect(result).toEqual(
        expect.objectContaining({
          id: 'task-1',
          title: validData.title
        })
      );
    });
  });

  describe('VALIDATION ERRORS', () => {
    it('should throw error when data is missing', async () => {
      await expect(
        BusinessService.createTask(tenantId, userId, null)
      ).rejects.toThrow('Data not found');
    });

    it('should throw error when assigned email is missing', async () => {
      await expect(
        BusinessService.createTask(tenantId, userId, {})
      ).rejects.toThrow('Assigned user email required');
    });
  });

  describe('BUSINESS RULE ERRORS', () => {
    it('should throw error when assigned user does not exist', async () => {
      AuthRepository.findbyemail.mockResolvedValue(null);

      await expect(
        BusinessService.createTask(tenantId, userId, validData)
      ).rejects.toThrow('Assigned user not found');
    });

    it('should throw error when assigned user is not in tenant', async () => {
      AuthRepository.findbyemail.mockResolvedValue({ id: 'user-2' });
      BusinessRepository.validateAssignUser.mockResolvedValue(false);

      await expect(
        BusinessService.createTask(tenantId, userId, validData)
      ).rejects.toThrow('User is not registered in tenant');
    });
  });

  describe('FAILURE CASE', () => {
    it('should throw error when task creation fails', async () => {
      AuthRepository.findbyemail.mockResolvedValue({ id: 'user-2' });
      BusinessRepository.validateAssignUser.mockResolvedValue(true);
      BusinessRepository.createTask.mockResolvedValue(null);

      await expect(
        BusinessService.createTask(tenantId, userId, validData)
      ).rejects.toThrow('Task was not created');
    });
  });
});
