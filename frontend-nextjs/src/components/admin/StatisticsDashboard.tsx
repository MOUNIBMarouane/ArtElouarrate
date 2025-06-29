
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Image, BarChart3, Users } from 'lucide-react';
import { ArtworkWithCategory } from '@/types/database';
import { Category } from '@/types/database';

interface StatisticsDashboardProps {
  artworks: ArtworkWithCategory[];
  categories: Category[];
}

const StatisticsDashboard = ({ artworks, categories }: StatisticsDashboardProps) => {
  const totalArtworks = artworks.length;
  const availableArtworks = artworks.filter(a => a.status === 'available').length;
  const soldArtworks = artworks.filter(a => a.status === 'sold').length;
  const totalValue = artworks.reduce((sum, artwork) => sum + artwork.price, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">Total Artworks</CardTitle>
          <Palette className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900">{totalArtworks}</div>
          <p className="text-xs text-blue-600">Across {categories.length} categories</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Available</CardTitle>
          <Image className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900">{availableArtworks}</div>
          <p className="text-xs text-green-600">Ready for sale</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-700">Sold</CardTitle>
          <BarChart3 className="h-5 w-5 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-900">{soldArtworks}</div>
          <p className="text-xs text-red-600">Completed sales</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">Total Value</CardTitle>
          <Users className="h-5 w-5 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-900">${totalValue.toLocaleString()}</div>
          <p className="text-xs text-purple-600">Collection value</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsDashboard;
