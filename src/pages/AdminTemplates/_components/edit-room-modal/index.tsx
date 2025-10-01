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
import { useState, useEffect } from "react";
import type { Room, EditRoomModalProps } from "@/interfaces/room.interface";
import { updateRoomApi } from "@/services/room.api";
// import { useToast } from "@/components/ui/use-toast"; // optional

// Type-safe amenity keys
type AmenityKey =
  | "wifi"
  | "dieuHoa"
  | "tivi"
  | "bep"
  | "mayGiat"
  | "banLa"
  | "banUi"
  | "hoBoi"
  | "doXe";

const amenities: { key: AmenityKey; label: string }[] = [
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

export default function EditRoomModal({
  isOpen,
  onClose,
  room,
  onSuccess,
}: EditRoomModalProps) {
  const [formData, setFormData] = useState<Partial<Room>>({});
  const [loading, setLoading] = useState(false);
  // const { toast } = useToast();

  // Reset form data on room change or modal close
  useEffect(() => {
    if (room) {
      setFormData(room);
    } else {
      setFormData({});
    }
  }, [room, isOpen]);

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
      // toast({ title: "✅ Room updated successfully!" });
    } catch (error) {
      console.error("Failed to update room:", error);
      // toast({ title: "❌ Failed to update room", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Room</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Room info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Room Name</label>
              <Input
                value={formData.tenPhong || ""}
                onChange={(e) => handleChange("tenPhong", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Price ($)</label>
              <Input
                type="number"
                value={formData.giaTien ?? ""}
                onChange={(e) =>
                  handleChange(
                    "giaTien",
                    e.target.value ? Number(e.target.value) : 0
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Guests</label>
              <Input
                type="number"
                value={formData.khach ?? ""}
                onChange={(e) =>
                  handleChange(
                    "khach",
                    e.target.value ? Number(e.target.value) : 0
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Bedrooms</label>
              <Input
                type="number"
                value={formData.phongNgu ?? ""}
                onChange={(e) =>
                  handleChange(
                    "phongNgu",
                    e.target.value ? Number(e.target.value) : 0
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Beds</label>
              <Input
                type="number"
                value={formData.giuong ?? ""}
                onChange={(e) =>
                  handleChange(
                    "giuong",
                    e.target.value ? Number(e.target.value) : 0
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Baths</label>
              <Input
                type="number"
                value={formData.phongTam ?? ""}
                onChange={(e) =>
                  handleChange(
                    "phongTam",
                    e.target.value ? Number(e.target.value) : 0
                  )
                }
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <Textarea
              rows={4}
              value={formData.moTa || ""}
              onChange={(e) => handleChange("moTa", e.target.value)}
              className="resize-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium">Image URL</label>
            <Input
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

          {/* Amenities */}
          <div>
            <p className="text-sm font-medium mb-2">Amenities</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {amenities.map((a) => (
                <label key={a.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={Boolean(formData[a.key])}
                    onChange={() => handleCheckboxChange(a.key)}
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
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
