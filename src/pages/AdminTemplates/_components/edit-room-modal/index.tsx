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
import React, { useState, useEffect } from "react";
import type { Room, EditRoomModalProps } from "@/interfaces/room.interface";
import { updateRoomApi } from "@/services/room.api";

export default function EditRoomModal({
  isOpen,
  onClose,
  room,
  onSuccess,
}: EditRoomModalProps) {
  const [formData, setFormData] = useState<Partial<Room>>(room || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (room) setFormData(room);
  }, [room]);

  const handleChange = (field: keyof Room, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof Room) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    if (!room) return;
    setLoading(true);
    try {
      await updateRoomApi(room.id, formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update room:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            ✏️ Edit Room
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Room Name"
              value={formData.tenPhong || ""}
              onChange={(e) => handleChange("tenPhong", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Price ($)"
              value={formData.giaTien ?? ""}
              onChange={(e) => handleChange("giaTien", Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Guests"
              value={formData.khach ?? ""}
              onChange={(e) => handleChange("khach", Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Bedrooms"
              value={formData.phongNgu ?? ""}
              onChange={(e) => handleChange("phongNgu", Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Beds"
              value={formData.giuong ?? ""}
              onChange={(e) => handleChange("giuong", Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Baths"
              value={formData.phongTam ?? ""}
              onChange={(e) => handleChange("phongTam", Number(e.target.value))}
            />
          </div>

          <Textarea
            rows={3}
            placeholder="Room description..."
            value={formData.moTa || ""}
            onChange={(e) => handleChange("moTa", e.target.value)}
          />

          <div>
            <Input
              placeholder="Image URL"
              value={formData.hinhAnh || ""}
              onChange={(e) => handleChange("hinhAnh", e.target.value)}
            />
            {formData.hinhAnh && (
              <img
                src={formData.hinhAnh}
                alt="Preview"
                className="mt-2 h-28 w-40 object-cover rounded border"
              />
            )}
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Amenities</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {[
                "wifi",
                "dieuHoa",
                "hoBoi",
                "doXe",
                "tivi",
                "bep",
                "mayGiat",
                "banLa",
                "banUi",
              ].map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(formData[amenity as keyof Room])}
                    onChange={() => handleCheckboxChange(amenity as keyof Room)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="capitalize">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
