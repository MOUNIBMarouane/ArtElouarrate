import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useDeleteArtwork } from "@/hooks/useArtworks";
import ArtworkForm from "@/components/art-management/ArtworkForm";
import { ArtworkWithCategory } from "@/types/database";
import { Category } from "@/types/database";
import { getImageUrl } from "@/lib/utils";

interface ArtworkManagementSectionProps {
  artworks: ArtworkWithCategory[];
  categories: Category[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ArtworkManagementSection = ({
  artworks,
  categories,
  searchTerm,
  onSearchChange,
}: ArtworkManagementSectionProps) => {
  const [isArtworkDialogOpen, setIsArtworkDialogOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] =
    useState<ArtworkWithCategory | null>(null);
  const deleteArtwork = useDeleteArtwork();

  const filteredArtworks = artworks.filter(
    (artwork) =>
      artwork.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.category?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      artwork.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditArtwork = (artwork: ArtworkWithCategory) => {
    setEditingArtwork(artwork);
    setIsArtworkDialogOpen(true);
  };

  const handleDeleteArtwork = (id: string) => {
    if (window.confirm("Are you sure you want to delete this artwork?")) {
      deleteArtwork.mutate(id);
    }
  };

  const closeArtworkDialog = () => {
    setIsArtworkDialogOpen(false);
    setEditingArtwork(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-red-100 text-red-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="text-2xl">Artwork Management</CardTitle>
              <CardDescription>
                Manage your artwork collection with image uploads
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setEditingArtwork(null);
                setIsArtworkDialogOpen(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Artwork
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search artworks by name, category, or description..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArtworks.map((artwork) => (
                  <TableRow key={artwork.id}>
                    <TableCell>
                      <img
                        src={getImageUrl(artwork.images?.[0]?.url)}
                        alt={artwork.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {artwork.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="text-white"
                        style={{
                          backgroundColor: artwork.category?.color || "#8B5CF6",
                        }}
                      >
                        {artwork.category?.name}
                      </Badge>
                    </TableCell>
                    <TableCell>${artwork.price}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(artwork.status)}>
                        {artwork.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{artwork.year}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditArtwork(artwork)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteArtwork(artwork.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Artwork Form Dialog */}
      {isArtworkDialogOpen && (
        <ArtworkForm
          artwork={editingArtwork}
          categories={categories}
          onClose={closeArtworkDialog}
        />
      )}
    </>
  );
};

export default ArtworkManagementSection;
