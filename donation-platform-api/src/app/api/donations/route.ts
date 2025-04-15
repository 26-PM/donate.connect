import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import { authenticateToken } from '@/lib/middleware/auth';
import Donation from '@/lib/models/Donation';

// GET all donations
export async function GET(req: Request) {
  try {
    await connectDB();
    const donations = await Donation.find()
      .populate('user', 'name email')
      .populate('ngo', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(donations);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching donations', error: error.message },
      { status: 500 }
    );
  }
}

// POST new donation
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const donation = await Donation.create(body);

    return NextResponse.json(
      { message: 'Donation created successfully', donation },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error creating donation', error: error.message },
      { status: 500 }
    );
  }
} 