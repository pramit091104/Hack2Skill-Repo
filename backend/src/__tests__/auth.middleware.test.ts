/// <reference types="jest" />
import { requireAuth } from '../middlewares/auth.middleware';
import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

jest.mock('../config/firebase', () => ({
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
    jest.clearAllMocks();
  });

  it('should return 401 if no authorization header is present', async () => {
    await requireAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Unauthorized' }));
  });

  it('should return 401 if authorization header does not start with Bearer', async () => {
    mockRequest.headers = { authorization: 'Basic sometoken' };
    await requireAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized', message: 'Missing or invalid Authorization header' });
  });

  it('should set req.user and call next if token is valid', async () => {
    mockRequest.headers = { authorization: 'Bearer validtoken' };
    const decodedToken = { uid: '12345', email: 'test@test.com' };
    (auth.verifyIdToken as jest.Mock).mockResolvedValue(decodedToken);

    await requireAuth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(auth.verifyIdToken).toHaveBeenCalledWith('validtoken');
    expect((mockRequest as any).user).toEqual(decodedToken);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid or expired', async () => {
    mockRequest.headers = { authorization: 'Bearer invalidtoken' };
    (auth.verifyIdToken as jest.Mock).mockRejectedValue(new Error('Token expired'));

    await requireAuth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(auth.verifyIdToken).toHaveBeenCalledWith('invalidtoken');
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized', message: 'Invalid or expired token' });
  });
});
