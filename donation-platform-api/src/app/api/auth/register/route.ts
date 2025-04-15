import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Ngo } from '../../../../lib/models/Ngo';
import { connectDB } from '../../../../lib/config/db';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, registrationNumber, email, password, mobile, address } = body;

    // Check if NGO already exists
    const existingNgo = await Ngo.findOne({
      $or: [{ email }, { registrationNumber }],
    });

    if (existingNgo) {
      return NextResponse.json(
        { message: 'NGO with this email or registration number already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new NGO
    const ngo = await Ngo.create({
      name,
      registrationNumber,
      email,
      password: hashedPassword,
      mobile,
      address,
    });

    // Remove password from response
    const { password: _, ...ngoWithoutPassword } = ngo.toObject();

    return NextResponse.json(
      { message: 'NGO registered successfully', ngo: ngoWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error registering NGO', error: error.message },
      { status: 500 }
    );
  }
} 