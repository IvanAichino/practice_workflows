import { Response } from 'express';
import { ResponseHelper } from '../../utils/responseHelper';

describe('ResponseHelper', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('success', () => {
    it('should send success response with correct format', () => {
      const testData = { test: 'data' };
      const message = 'Test success';
      const requestId = 'test-request-id';

      ResponseHelper.success(mockResponse as Response, testData, message, 200, requestId);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: testData,
        message,
        timestamp: expect.any(String),
        requestId,
      });
    });

    it('should use default values when optional parameters are not provided', () => {
      const testData = { test: 'data' };

      ResponseHelper.success(mockResponse as Response, testData);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: testData,
        message: 'Success',
        timestamp: expect.any(String),
        requestId: undefined,
      });
    });
  });

  describe('error', () => {
    it('should send error response with correct format', () => {
      const errorMessage = 'Test error';
      const requestId = 'test-request-id';

      ResponseHelper.error(mockResponse as Response, errorMessage, 400, requestId);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: errorMessage,
        message: 'Error occurred',
        timestamp: expect.any(String),
        requestId,
      });
    });
  });

  describe('validationError', () => {
    it('should send validation error with 400 status', () => {
      const errorMessage = 'Validation failed';
      const requestId = 'test-request-id';

      ResponseHelper.validationError(mockResponse as Response, errorMessage, requestId);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('notFound', () => {
    it('should send not found error with 404 status', () => {
      const requestId = 'test-request-id';

      ResponseHelper.notFound(mockResponse as Response, undefined, requestId);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Resource not found',
        message: 'Error occurred',
        timestamp: expect.any(String),
        requestId,
      });
    });
  });
});