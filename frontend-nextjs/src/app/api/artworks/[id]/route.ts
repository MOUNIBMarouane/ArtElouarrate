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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const artwork = artworks.find(art => art.id === params.id);
  
  if (artwork) {
    return NextResponse.json(artwork);
  } else {
    return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
  }
} 