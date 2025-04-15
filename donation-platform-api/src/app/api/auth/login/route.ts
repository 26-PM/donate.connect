import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Ngo } from '../../../../lib/models/Ngo';
import User from '../../../../lib/models/User';
import { connectDB } from '../../../../lib/config/db';
import { cookies } from 'next/headers';

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
    const trimmedEmail = email.trim().toLowerCase();

    // Try logging in as User first
    let account = await User.findOne({ email: trimmedEmail });
    let type = "user";

    // If not found, try as NGO
    if (!account) {
      account = await Ngo.findOne({ email: trimmedEmail });
      type = "ngo";
    }

    if (!account) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Invalid credentials' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Invalid credentials' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: account._id, type }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '7d' }
    );

    // Create response
    const response = new NextResponse(
      JSON.stringify({
        success: true,
        message: 'Login successful',
        type,
        token
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: 'Server error', 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
} 