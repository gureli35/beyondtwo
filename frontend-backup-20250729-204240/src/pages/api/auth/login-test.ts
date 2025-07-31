import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const { email, password } = req.body;
  
  console.log('Login test endpoint called:', { email, passwordLength: password?.length });

  // Test credentials
  if (email === 'admin@beyond2c.com' && password === 'admin123') {
    return res.status(200).json({
      success: true,
      data: {
        user: {
          _id: '1',
          email: 'admin@beyond2c.com',
          username: 'admin',
          isAdmin: true,
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User'
        },
        token: 'test-token-123'
      },
      message: 'Login successful'
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid credentials. Please check your email and password.'
  });
}
