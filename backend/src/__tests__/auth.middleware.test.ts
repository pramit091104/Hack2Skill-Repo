import { requireAuth } from '../../middlewares/auth.middleware';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../config/firebase', () => ({
  auth: {
    verifyIdToken: jest.fn()
  }
}));

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return 401 if no authorization header is present', async () => {
    await requireAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Unauthorized' }));
  });
});
