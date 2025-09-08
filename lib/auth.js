import { verifyToken } from './jwt';

export async function verifyAuth(request) {
  try {
    // Get token from headers
    const authorization = request.headers.get('authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return { error: 'Please login to access this resource', status: 401 };
    }

    const token = authorization.split(' ')[1];
    
    if (!token) {
      return { error: 'Please login to access this resource', status: 401 };
    }

    const decoded = verifyToken(token);
    
    if (!decoded || (!decoded.id && !decoded.userId)) {
      return { error: 'Invalid or expired token', status: 401 };
    }

    const userId = decoded.userId || decoded.id;
    return { userId, user: decoded };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Authentication error', status: 401 };
  }
}
