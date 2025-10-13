import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const UpdateSkillSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters')
    .optional(),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters')
    .optional(),
  level: z
    .number()
    .int()
    .min(1, 'Level must be at least 1')
    .max(5, 'Level must be at most 5')
    .optional(),
  iconUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  order: z.number().int().min(0, 'Order must be non-negative').optional(),
});

// PUT /api/skills/[id] - Update skill
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = UpdateSkillSchema.parse(body);

    // Check if skill exists
    const existingSkill = await prisma.skill.findUnique({
      where: { id: params.id },
    });

    if (!existingSkill) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      );
    }

    // Check if skill with same name and category already exists (if name or category is being updated)
    if (validatedData.name || validatedData.category) {
      const name = validatedData.name || existingSkill.name;
      const category = validatedData.category || existingSkill.category;

      const duplicateSkill = await prisma.skill.findFirst({
        where: {
          name,
          category,
          NOT: { id: params.id },
        },
      });

      if (duplicateSkill) {
        return NextResponse.json(
          {
            success: false,
            error: 'Skill with this name and category already exists',
          },
          { status: 400 }
        );
      }
    }

    const updatedSkill = await prisma.skill.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      data: updatedSkill,
      message: 'Skill updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE /api/skills/[id] - Delete skill
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if skill exists
    const existingSkill = await prisma.skill.findUnique({
      where: { id: params.id },
    });

    if (!existingSkill) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      );
    }

    await prisma.skill.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}
