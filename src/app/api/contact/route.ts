import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    console.log('Contact API called');
    const body = await req.json();
    console.log('Request body:', body);
    
    const data = ContactSchema.parse(body);
    console.log('Validated data:', data);

    // Store contact message in database
    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    });

    console.log('Contact message stored:', contact);

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Full error details:', error);
    
    if (error instanceof z.ZodError) {
      console.error('Validation error details:', error.issues);
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Error storing contact message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message', details: error.message },
      { status: 500 }
    );
  }
}
