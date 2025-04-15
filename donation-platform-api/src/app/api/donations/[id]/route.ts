import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import { authenticateToken } from '@/lib/middleware/auth';
import Donation from '@/lib/models/Donation';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET single donation
export async function GET(req: Request, { params }: RouteParams) {
  try {
    await connectDB();
    const donation = await Donation.findById(params.id)
      .populate('user', 'name email')
      .populate('ngo', 'name email');

    if (!donation) {
      return NextResponse.json(
        { message: 'Donation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(donation);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching donation', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH update donation status
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    await connectDB();
    const { status } = await req.json();

    const donation = await Donation.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    ).populate('user', 'name email')
     .populate('ngo', 'name email');

    if (!donation) {
      return NextResponse.json(
        { message: 'Donation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Donation status updated successfully',
      donation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error updating donation', error: error.message },
      { status: 500 }
    );
  }
} 