import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Palette } from "lucide-react";
import { Category } from "@/types/database";
import {
  useAddCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";

interface CategoryManagerProps {
  categories: Category[];
}

const CategoryManager = ({ categories }: CategoryManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#8B5CF6",
  });

  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const colorOptions = [
    "#8B5CF6",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#6366F1",
    "#84CC16",
    "#F97316",
    "#14B8A6",
    "#A855F7",
  ];

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#8B5CF6",
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      updateCategory.mutate(
        { id: editingCategory.id, category: formData },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            resetForm();
          },
        }
      );
    } else {
      addCategory.mutate(formData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const handleDelete = (id: string, name: string, artworkCount?: number) => {
    let confirmMessage = `Are you sure you want to delete the category "${name}"?`;

    if (artworkCount && artworkCount > 0) {
      confirmMessage = `The category "${name}" contains ${artworkCount} artwork(s). You cannot delete this category until you move or delete all artworks in it.\n\nWould you like to proceed anyway? (This will fail)`;
    }

    if (window.confirm(confirmMessage)) {
      deleteCategory.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Category Management
          </h2>
          <p className="text-gray-600">
            Organize your artwork collection with custom categories
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Create New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="e.g., Landscapes, Portraits"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={3}
                  placeholder="Brief description of this category"
                />
              </div>
              <div>
                <Label>Category Color</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.color === color
                          ? "border-gray-900 scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <Button
                type="submit"
                disabled={addCategory.isPending || updateCategory.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {category.name}
                    </h3>
                    <Badge
                      className="text-white text-xs mt-1"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.color}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                {category.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <Badge
                  variant={category.artworkCount > 0 ? "default" : "secondary"}
                >
                  {category.artworkCount || 0} artworks
                </Badge>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(category)}
                  className="flex-1 hover:bg-purple-50 hover:border-purple-300"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
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
                  disabled={deleteCategory.isPending}
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-300">
          <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No categories created yet.</p>
          <p className="text-gray-400">
            Start by adding your first category to organize your artwork.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
