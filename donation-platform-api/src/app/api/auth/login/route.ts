import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Ngo } from '@/lib/models/Ngo';
import { connectDB } from '@/lib/config/db';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // Find NGO by email
    const ngo = await Ngo.findOne({ email });
    if (!ngo) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, ngo.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign({ id: ngo._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    // Remove password from response
    const { password: _, ...ngoWithoutPassword } = ngo.toObject();

    return NextResponse.json({
      message: 'Login successful',
      token,
      ngo: ngoWithoutPassword,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error logging in', error: error.message },
      { status: 500 }
    );
  }
} 