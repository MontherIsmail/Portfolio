import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const ExperienceSchema = z.object({
  company: z
    .string()
    .min(1, 'Company is required')
    .max(100, 'Company must be less than 100 characters'),
  role: z
    .string()
    .min(1, 'Role is required')
    .max(100, 'Role must be less than 100 characters'),
  startDate: z.string().datetime('Must be a valid date'),
  endDate: z
    .string()
    .datetime('Must be a valid date')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  current: z.boolean().optional().default(false),
  order: z
    .number()
    .int()
    .min(0, 'Order must be non-negative')
    .optional()
    .default(0),
});

const UpdateExperienceSchema = ExperienceSchema.partial();

// GET /api/experience - List all experience with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const current = searchParams.get('current');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (current !== null) {
      where.current = current === 'true';
    }
    if (search) {
      where.OR = [
        { company: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [experiences, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
      }),
      prisma.experience.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: experiences,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}

// POST /api/experience - Create new experience
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ExperienceSchema.parse(body);

    // Convert string dates to Date objects
    const dataWithDates = {
      ...validatedData,
      startDate: new Date(validatedData.startDate),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
    };

    // Validate date logic
    if (
      dataWithDates.endDate &&
      dataWithDates.endDate <= dataWithDates.startDate
    ) {
      return NextResponse.json(
        { success: false, error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (dataWithDates.current && dataWithDates.endDate) {
      return NextResponse.json(
        { success: false, error: 'Current experience cannot have an end date' },
        { status: 400 }
      );
    }

    const experience = await prisma.experience.create({
      data: dataWithDates,
    });

    return NextResponse.json(
      {
        success: true,
        data: experience,
        message: 'Experience created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}
