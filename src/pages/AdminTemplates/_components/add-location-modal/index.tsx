import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addLocationApi, uploadLocationImageApi } from "@/services/locationApi";

// ✅ Create a lightweight input type (backend expects these fields only)
interface LocationInput {
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh?: string;
}

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddLocationModal({
  isOpen,
  onClose,
}: AddLocationModalProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<LocationInput>({
    tenViTri: "",
    tinhThanh: "",
    quocGia: "",
    hinhAnh: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const addMutation = useMutation({
    mutationFn: (data: LocationInput) => addLocationApi(data),
    onSuccess: async (newLoc) => {
      if (file && newLoc?.id) {
        await uploadLocationImageApi(newLoc.id, file);
      }
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      onClose();
    },
  });

  const handleChange = (key: keyof LocationInput, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Location name"
            value={formData.tenViTri}
            onChange={(e) => handleChange("tenViTri", e.target.value)}
            required
          />
          <Input
            placeholder="City"
            value={formData.tinhThanh}
            onChange={(e) => handleChange("tinhThanh", e.target.value)}
            required
          />
          <Input
            placeholder="Country"
            value={formData.quocGia}
            onChange={(e) => handleChange("quocGia", e.target.value)}
            required
          />

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addMutation.isPending}>
              {addMutation.isPending ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
