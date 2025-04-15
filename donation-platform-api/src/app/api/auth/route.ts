import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Handle different auth routes based on the pathname
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    switch(path) {
      case 'signup':
        // Your signup logic here
        const newUser = new User(body);
        await newUser.save();
        return NextResponse.json({ success: true, data: newUser });

      case 'login':
        // Your login logic here
        const user = await User.findOne({ email: body.email });
        if (!user) {
          return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        // Add password verification here
        return NextResponse.json({ success: true, data: user });

      default:
        return NextResponse.json({ success: false, message: 'Route not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 