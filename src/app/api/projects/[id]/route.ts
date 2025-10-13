import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const UpdateProjectSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .optional(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  imageUrl: z.string().url('Must be a valid URL').optional(),
  link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  technologies: z
    .array(z.string())
    .min(1, 'At least one technology is required')
    .optional(),
  featured: z.boolean().optional(),
});

// GET /api/projects/[id] - Get specific project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = UpdateProjectSchema.parse(body);

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if slug already exists (if slug is being updated)
    if (validatedData.slug && validatedData.slug !== existingProject.slug) {
      const slugExists = await prisma.project.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Project with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
