import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateLocationApi,
  uploadLocationImageApi,
} from "@/services/locationApi";
import type { Location } from "@/services/locationApi";

interface EditLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
}

export default function EditLocationModal({
  isOpen,
  onClose,
  location,
}: EditLocationModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Location>>({});
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (location) {
      setFormData({
        tenViTri: location.tenViTri,
        tinhThanh: location.tinhThanh,
        quocGia: location.quocGia,
        hinhAnh: location.hinhAnh,
      });
    }
  }, [location]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Location>) =>
      updateLocationApi(location!.id, data),
    onSuccess: async () => {
      if (file && location) {
        await uploadLocationImageApi(location.id, file);
      }
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      onClose();
    },
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Location name"
            value={formData.tenViTri || ""}
            onChange={(e) => handleChange("tenViTri", e.target.value)}
          />
          <Input
            placeholder="City"
            value={formData.tinhThanh || ""}
            onChange={(e) => handleChange("tinhThanh", e.target.value)}
          />
          <Input
            placeholder="Country"
            value={formData.quocGia || ""}
            onChange={(e) => handleChange("quocGia", e.target.value)}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {formData.hinhAnh && (
            <img
              src={formData.hinhAnh}
              alt="Preview"
              className="w-40 h-28 object-cover rounded border"
            />
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
