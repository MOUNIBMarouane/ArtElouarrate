import { NextResponse } from 'next/server';

// Mock categories data
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

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    data: categories
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real app, you would save this to a database
    const newCategory = {
      id: categories.length + 1,
      ...body,
      count: 0,
      slug: body.name.toLowerCase().replace(/\s+/g, '-')
    };
    
    categories.push(newCategory);
    
    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
} 