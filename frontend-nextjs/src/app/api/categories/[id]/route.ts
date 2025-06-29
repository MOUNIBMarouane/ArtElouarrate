import { NextResponse } from 'next/server';

// Import the categories from the parent route file
const categories = [
  {
    id: 1,
    name: 'Portraits',
    slug: 'portraits',
    description: 'Realistic portrait drawings that capture personality and emotion',
    image: '/lovable-uploads/1dcc313f-7f0b-4090-9dc3-42d07e5291bf.png',
    count: 5
  },
  {
    id: 2,
    name: 'Wildlife',
    slug: 'wildlife',
    description: 'Detailed drawings of animals in their natural habitats',
    image: '/lovable-uploads/2fbe62dd-237c-4c35-8bd4-b3c4d5d69c05.png',
    count: 8
  },
  {
    id: 3,
    name: 'Landscapes',
    slug: 'landscapes',
    description: 'Beautiful pencil drawings of natural and urban landscapes',
    image: '/lovable-uploads/03bcb36b-2cef-49c5-bebf-3ee8f4c081d2.png',
    count: 6
  },
  {
    id: 4,
    name: 'Still Life',
    slug: 'still-life',
    description: 'Detailed compositions of everyday objects',
    image: '/lovable-uploads/6472ba85-9629-4ee4-b31e-6cb52f2f6699.png',
    count: 4
  },
  {
    id: 5,
    name: 'Abstract',
    slug: 'abstract',
    description: 'Creative abstract compositions that spark imagination',
    image: '/lovable-uploads/5632be5b-8b74-457c-8ea8-30f3985cae44.png',
    count: 3
  },
  {
    id: 6,
    name: 'Architecture',
    slug: 'architecture',
    description: 'Detailed architectural drawings and studies',
    image: '/lovable-uploads/932dc5ad-3774-42d4-a621-edbc74c310fb.png',
    count: 2
  }
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Convert the ID to a number since our categories use numeric IDs
  const categoryId = parseInt(params.id);
  
  if (isNaN(categoryId)) {
    return NextResponse.json(
      { success: false, error: 'Invalid category ID' },
      { status: 400 }
    );
  }
  
  // Find the category by ID
  const category = categories.find(cat => cat.id === categoryId);
  
  if (category) {
    return NextResponse.json({ success: true, data: category });
  } else {
    return NextResponse.json(
      { success: false, error: 'Category not found' },
      { status: 404 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }
    
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    const updatedData = await request.json();
    
    // Update the category with new data
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      ...updatedData,
      // Make sure the slug is updated if the name changes
      ...(updatedData.name ? { slug: updatedData.name.toLowerCase().replace(/\s+/g, '-') } : {})
    };
    
    return NextResponse.json({ success: true, data: categories[categoryIndex] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }
    
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Remove the category from the array
    const removedCategory = categories.splice(categoryIndex, 1)[0];
    
    return NextResponse.json({
      success: true,
      data: removedCategory,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 