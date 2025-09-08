import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/user';

export async function POST(request) {
  try {
    await connectDB();
    
    const { name, email, phone, password } = await request.json();

    // Validate input
    if (!name || !email || !password || !phone?.primary) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields including primary phone number' },
        { status: 400 }
      );
    }

    const lowercaseEmail = email.toLowerCase();

    // Check if user exists
    const existingUser = await User.findOne({ email: lowercaseEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user (password will be hashed by the pre-save hook)
    const user = await User.create({
      name,
      email: lowercaseEmail,
      phone: {
        primary: phone.primary,
        secondary: phone.secondary || ''
      },
      password: password, // Don't hash here - let the pre-save hook handle it
      role: 'user'
    });

    // Create token
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Create the response
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Error creating user' },
      { status: 500 }
    );
  }
}
