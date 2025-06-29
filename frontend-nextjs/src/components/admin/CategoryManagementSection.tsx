import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Palette } from "lucide-react";
import {
  useCategories,
  useAddCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import { Category } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

interface CategoryManagementSectionProps {
  categories: Category[];
}

const CategoryManagementSection = ({
  categories,
}: CategoryManagementSectionProps) => {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#8B5CF6",
  });

  // Debug logging
  console.log("🔍 CategoryManagementSection - Categories received:", {
    categories,
    length: categories?.length,
    type: typeof categories,
    isArray: Array.isArray(categories),
  });

  const { toast } = useToast();
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
        color: category.color || "#8B5CF6",
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        color: "#8B5CF6",
      });
    }
    setIsCategoryDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCategoryDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      color: "#8B5CF6",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          category: {
            ...formData,
            isActive: true,
            sortOrder: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      } else {
        await addCategory.mutateAsync({
          ...formData,
          isActive: true,
          sortOrder: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (
    id: string,
    name: string,
    artworkCount?: number
  ) => {
    let confirmMessage = `Are you sure you want to delete the category "${name}"?`;

    if (artworkCount && artworkCount > 0) {
      confirmMessage = `The category "${name}" contains ${artworkCount} artwork(s). You cannot delete this category until you move or delete all artworks in it.\n\nWould you like to proceed anyway? (This will fail)`;
    }

    if (window.confirm(confirmMessage)) {
      try {
        await deleteCategory.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting category:", error);
        // Error handling is now done in the hook
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="text-2xl">Category Management</CardTitle>
              <CardDescription>
                Organize your artworks into categories
              </CardDescription>
            </div>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Color</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Artworks</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: category.color }}
                        />
                        <Badge
                          className="text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          <Palette className="h-3 w-3 mr-1" />
                          {category.color}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description || "No description"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          category.artworkCount > 0 ? "default" : "secondary"
                        }
                      >
                        {category.artworkCount || 0} artworks
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDelete(
                              category.id,
                              category.name,
                              category.artworkCount
                            )
                          }
                          className="text-red-600 hover:text-red-700"
                          disabled={deleteCategory.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {categories.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      No categories found. Create your first category!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Category Form Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category information below."
                : "Create a new category to organize your artworks."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter category description (optional)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Category Color</Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="#8B5CF6"
                  className="flex-1"
                />
                <div
                  className="w-10 h-10 rounded border-2 border-gray-300"
                  style={{ backgroundColor: formData.color }}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addCategory.isPending || updateCategory.isPending}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {addCategory.isPending || updateCategory.isPending
                  ? "Saving..."
                  : editingCategory
                  ? "Update Category"
                  : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryManagementSection;
