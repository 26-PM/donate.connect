import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import { Ngo } from '../../../../lib/models/Ngo';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET single NGO
export async function GET(req: Request, { params }: RouteParams) {
  try {
    await connectDB();
    const ngo = await Ngo.findById(params.id).select('-password');

    if (!ngo) {
      return NextResponse.json(
        { message: 'NGO not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(ngo);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching NGO', error: error.message },
      { status: 500 }
    );
  }
} 