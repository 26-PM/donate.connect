import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import { Ngo } from '../../../../lib/models/Ngo';

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
          { 'address.city': { $regex: search, $options: 'i' } }
        ]
      };
    }

    const ngos = await Ngo.find(query)
      .select('name email mobile address itemsAccepted') // Only select necessary fields
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      ngos
    });
  } catch (error: any) {
    console.error('Error fetching NGOs:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error fetching NGOs', 
        error: error.message 
      },
      { status: 500 }
    );
  }
} 