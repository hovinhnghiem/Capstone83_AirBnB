import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getPaginatedLocationsApi,
  deleteLocationApi,
} from "@/services/locationApi";
import type { Location } from "@/services/locationApi";
import AddLocationModal from "../_components/add-location-modal";
import EditLocationModal from "../_components/edit-location-modal";
export default function LocationManagement() {
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(1);
  const [keyword, setKeyword] = useState("");
  const pageSize = 5;
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const { data, isLoading, error } = useQuery({
    queryKey: ["locations", pageIndex, keyword],
    queryFn: () => getPaginatedLocationsApi(pageIndex, pageSize, keyword),
    placeholderData: (previous) => previous,
  });

  const locations: Location[] = data?.content?.data || [];
  const totalPages = data?.content
    ? Math.ceil(data.content.totalRow / pageSize)
    : 1;
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteLocationApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
  const handleEdit = (loc: Location) => {
    setSelectedLocation(loc);
    setIsEditOpen(true);
  };
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this location?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p className="text-center py-6">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading data</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Location Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name or city…"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPageIndex(1);
            }}
            className="w-64"
          />
          <Button onClick={() => setIsAddOpen(true)}>+ Add Location</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 w-16">ID</th>
              <th className="border p-2 w-40">Name</th>
              <th className="border p-2 w-40">City</th>
              <th className="border p-2 w-40">Country</th>
              <th className="border p-2 w-40">Image</th>
              <th className="border p-2 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.length > 0 ? (
              locations.map((location) => (
                <tr key={location.id}>
                  <td className="border p-2 text-center">{location.id}</td>
                  <td className="border p-2 text-center">
                    {location.tenViTri}
                  </td>
                  <td className="border p-2 text-center">
                    {location.tinhThanh}
                  </td>
                  <td className="border p-2 text-center">{location.quocGia}</td>
                  <td className="border p-2 text-center">
                    {location.hinhAnh ? (
                      <img
                        src={location.hinhAnh}
                        alt={location.tenViTri}
                        className="h-16 w-full object-cover rounded"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(location)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(location.id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No locations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex((page) => Math.max(1, page - 1))}
          disabled={pageIndex === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {pageIndex} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex((page) => Math.min(totalPages, page + 1))}
          disabled={pageIndex >= totalPages}
        >
          Next
        </Button>
      </div>
      <AddLocationModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
      <EditLocationModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        location={selectedLocation}
      />
    </div>
  );
}
