import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Ngo } from '../../../../lib/models/Ngo';
import { connectDB } from '../../../../lib/config/db';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // Find NGO by email
    const ngo = await Ngo.findOne({ email });
    if (!ngo) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, ngo.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign({ id: ngo._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    // Remove password from response
    const { password: _, ...ngoWithoutPassword } = ngo.toObject();

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      ngo: ngoWithoutPassword,
    });

    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Error logging in', error: error.message },
      { status: 500 }
    );
  }
} 