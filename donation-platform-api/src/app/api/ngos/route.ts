import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/config/db';
import { Ngo } from '../../../lib/models/Ngo';

// GET all NGOs
export async function GET(req: Request) {
  try {
    await connectDB();
    
    // Get search query from URL
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const ngos = await Ngo.find(query)
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 });

    return NextResponse.json(ngos);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching NGOs', error: error.message },
      { status: 500 }
    );
  }
} 