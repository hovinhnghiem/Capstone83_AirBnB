import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Room } from "@/interfaces/room.interface";
import { addRoomApi, uploadRoomImageApi } from "@/services/room.api";

export interface LocationType {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddRoomModal({
  isOpen,
  onClose,
  onSuccess,
}: AddRoomModalProps) {
  const [formData, setFormData] = useState<Partial<Room>>({
    tenPhong: "",
    khach: 1,
    phongNgu: 1,
    giuong: 1,
    phongTam: 1,
    moTa: "",
    giaTien: 0,
    maViTri: 1,
    wifi: true,
    dieuHoa: true,
    tivi: true,
    bep: true,
    mayGiat: true,
    banLa: true,
    banUi: true,
    hoBoi: true,
    doXe: true,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const amenities = [
    { key: "wifi", label: "Wifi" },
    { key: "dieuHoa", label: "Air Conditioning" },
    { key: "tivi", label: "Television" },
    { key: "bep", label: "Kitchen" },
    { key: "mayGiat", label: "Washing Machine" },
    { key: "banLa", label: "Ironing Table" },
    { key: "banUi", label: "Iron" },
    { key: "hoBoi", label: "Swimming Pool" },
    { key: "doXe", label: "Parking" },
  ];
  const { data: locations = [], isLoading } = useQuery<LocationType[]>({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/vi-tri`, {
        headers: { TokenCybersoft: import.meta.env.VITE_TOKEN_CYBERSOFT },
      });
      const data = await res.json();
      return Array.isArray(data.content) ? data.content : [];
    },
  });

  const handleChange = (key: keyof Room, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (field: keyof Room) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const newRoom = await addRoomApi(formData);

      for (const file of files) {
        await uploadRoomImageApi(newRoom.content.id, file);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("🚨 Failed to create room:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Room Name</label>
              <Input
                value={formData.tenPhong ?? ""}
                onChange={(e) => handleChange("tenPhong", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Price ($)</label>
              <Input
                type="number"
                value={formData.giaTien ?? 0}
                onChange={(e) =>
                  handleChange("giaTien", Number(e.target.value))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Guests</label>
              <Input
                type="number"
                value={formData.khach ?? 1}
                onChange={(e) => handleChange("khach", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Bedrooms</label>
              <Input
                type="number"
                value={formData.phongNgu ?? 1}
                onChange={(e) =>
                  handleChange("phongNgu", Number(e.target.value))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Beds</label>
              <Input
                type="number"
                value={formData.giuong ?? 1}
                onChange={(e) => handleChange("giuong", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Baths</label>
              <Input
                type="number"
                value={formData.phongTam ?? 1}
                onChange={(e) =>
                  handleChange("phongTam", Number(e.target.value))
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <Textarea
              rows={4}
              value={formData.moTa ?? ""}
              onChange={(e) => handleChange("moTa", e.target.value)}
              className="resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <select
              value={formData.maViTri ?? 1}
              onChange={(e) => handleChange("maViTri", Number(e.target.value))}
              className="w-full border p-2 rounded"
              disabled={isLoading}
            >
              {Array.isArray(locations) &&
                locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {String(loc.tenViTri)} -- {String(loc.tinhThanh)}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Upload Images</label>
            <Input type="file" multiple onChange={handleFileChange} />
            {files.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {files.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                    className="h-28 w-full object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Amenities</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {amenities.map((a) => (
                <label key={a.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={Boolean(formData[a.key as keyof Room])}
                    onChange={() => handleCheckboxChange(a.key as keyof Room)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>{a.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
