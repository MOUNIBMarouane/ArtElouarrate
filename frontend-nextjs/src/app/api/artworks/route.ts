import { NextResponse } from 'next/server';

// Mock artworks data
const artworks = [
  {
    id: '1',
    title: 'Mountain Sunset',
    name: 'Mountain Sunset',
    description: 'A beautiful sunset over mountain ranges',
    price: 1200,
    medium: 'Oil on canvas',
    dimensions: '60 × 80 cm',
    createdYear: '2023',
    images: [
      { url: '/lovable-uploads/5632be5b-8b74-457c-8ea8-30f3985cae44.png' }
    ],
    category: {
      id: '2',
      name: 'Landscapes'
    },
    featured: true,
    sold: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Portrait of Elegance',
    name: 'Portrait of Elegance',
    description: 'A stunning portrait capturing human emotion',
    price: 1500,
    medium: 'Acrylic on canvas',
    dimensions: '45 × 60 cm',
    createdYear: '2022',
    images: [
      { url: '/lovable-uploads/c47003b7-a74a-4460-85ef-d2574bdfc247.png' }
    ],
    category: {
      id: '1',
      name: 'Portraits'
    },
    featured: false,
    sold: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Abstract Dreams',
    name: 'Abstract Dreams',
    description: 'An abstract representation of dreams and emotions',
    price: 950,
    medium: 'Mixed media on canvas',
    dimensions: '50 × 70 cm',
    createdYear: '2023',
    images: [
      { url: '/lovable-uploads/6472ba85-9629-4ee4-b31e-6cb52f2f6699.png' }
    ],
    category: {
      id: '3',
      name: 'Abstract'
    },
    featured: true,
    sold: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Fruit Composition',
    name: 'Fruit Composition',
    description: 'A detailed still life composition of various fruits',
    price: 800,
    medium: 'Oil on panel',
    dimensions: '40 × 50 cm',
    createdYear: '2021',
    images: [
      { url: '/lovable-uploads/adb447be-2f2a-4657-b75e-739e41add877.png' }
    ],
    category: {
      id: '4',
      name: 'Still Life'
    },
    featured: false,
    sold: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET() {
  return NextResponse.json(artworks);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newArtwork = {
      id: (artworks.length + 1).toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    artworks.push(newArtwork);
    return NextResponse.json(newArtwork, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create artwork' }, { status: 500 });
  }
}

export async function GETMock() {
  // Mock artworks data
  const artworks = [
    {
      id: 1,
      title: 'Mountain Landscape',
      description: 'A detailed pencil drawing of a mountain landscape',
      price: 450,
      image: '/lovable-uploads/03bcb36b-2cef-49c5-bebf-3ee8f4c081d2.png',
      categoryId: 3,
      featured: true,
      sold: false,
      createdAt: '2023-06-15T10:30:00Z'
    },
    {
      id: 2,
      title: 'Portrait Study',
      description: 'A detailed portrait study in graphite pencil',
      price: 350,
      image: '/lovable-uploads/1dcc313f-7f0b-4090-9dc3-42d07e5291bf.png',
      categoryId: 1,
      featured: true,
      sold: true,
      createdAt: '2023-07-22T14:15:00Z'
    },
    {
      id: 3,
      title: 'Wolf Drawing',
      description: 'Realistic wolf portrait in pencil',
      price: 400,
      image: '/lovable-uploads/2fbe62dd-237c-4c35-8bd4-b3c4d5d69c05.png',
      categoryId: 2,
      featured: false,
      sold: false,
      createdAt: '2023-08-05T09:45:00Z'
    },
    {
      id: 4,
      title: 'Abstract Composition',
      description: 'Abstract pencil composition with geometric elements',
      price: 300,
      image: '/lovable-uploads/5632be5b-8b74-457c-8ea8-30f3985cae44.png',
      categoryId: 5,
      featured: false,
      sold: false,
      createdAt: '2023-09-12T16:20:00Z'
    },
    {
      id: 5,
      title: 'Still Life with Fruit',
      description: 'Detailed still life drawing of a fruit arrangement',
      price: 375,
      image: '/lovable-uploads/6472ba85-9629-4ee4-b31e-6cb52f2f6699.png',
      categoryId: 4,
      featured: true,
      sold: false,
      createdAt: '2023-10-03T11:10:00Z'
    },
    {
      id: 6,
      title: 'Gothic Cathedral',
      description: 'Architectural drawing of a gothic cathedral',
      price: 500,
      image: '/lovable-uploads/932dc5ad-3774-42d4-a621-edbc74c310fb.png',
      categoryId: 6,
      featured: true,
      sold: false,
      createdAt: '2023-11-18T13:25:00Z'
    },
    {
      id: 7,
      title: 'Dragon Fantasy',
      description: 'Fantasy drawing of a dragon in a mythical landscape',
      price: 450,
      image: '/lovable-uploads/adb447be-2f2a-4657-b75e-739e41add877.png',
      categoryId: 7,
      featured: false,
      sold: true,
      createdAt: '2023-12-07T15:40:00Z'
    },
    {
      id: 8,
      title: 'Custom Family Portrait',
      description: 'Commissioned family portrait in pencil',
      price: 600,
      image: '/lovable-uploads/c47003b7-a74a-4460-85ef-d2574bdfc247.png',
      categoryId: 8,
      featured: false,
      sold: true,
      createdAt: '2024-01-22T10:05:00Z'
    }
  ];

  return NextResponse.json({ 
    success: true,
    data: artworks
  });
} 