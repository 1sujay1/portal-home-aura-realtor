import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Property from '@/models/property';
import { verifyToken } from '@/lib/jwt';

export async function GET(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    const listings = await Property.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Convert _id to string and format dates
    const formattedListings = listings.map(listing => ({
      ...listing,
      _id: listing._id.toString(),
      createdAt: listing.createdAt.toISOString(),
      userId: listing.userId.toString()
    }));

    return NextResponse.json(formattedListings);
  } catch (error) {
    console.error('Get listings error:', error);
    return NextResponse.json(
      { error: 'Error fetching listings' },
      { status: 500 }
    );
  }
}
