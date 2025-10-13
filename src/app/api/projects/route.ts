import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const ProjectSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  imageUrl: z.string().url('Must be a valid URL'),
  link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  technologies: z
    .array(z.string())
    .min(1, 'At least one technology is required'),
  featured: z.boolean().optional().default(false),
});

const UpdateProjectSchema = ProjectSchema.partial();

// GET /api/projects - List all projects with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (featured !== null) {
      where.featured = featured === 'true';
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { technologies: { has: search } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: projects,
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
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ProjectSchema.parse(body);

    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project with this slug already exists' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: validatedData,
    });

    return NextResponse.json(
      {
        success: true,
        data: project,
        message: 'Project created successfully',
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

    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
