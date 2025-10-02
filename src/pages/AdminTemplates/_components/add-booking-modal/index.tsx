import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBookingApi } from "@/services/booking.api";
import type { Booking } from "@/interfaces/booking.interface";

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBookingModal({
  isOpen,
  onClose,
}: AddBookingModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Omit<Booking, "id">>({
    maPhong: 0,
    ngayDen: "",
    ngayDi: "",
    soLuongKhach: 1,
    maNguoiDung: 0,
  });
  const mutation = useMutation({
    mutationFn: addBookingApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
      setFormData({
        maPhong: 0,
        ngayDen: "",
        ngayDi: "",
        soLuongKhach: 1,
        maNguoiDung: 0,
      });
    },
  });
  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = () => {
    if (!currentUser) return;
    const payload = {
      ...formData,
      maNguoiDung: currentUser.id,
    };
    mutation.mutate(payload);
  };
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Booking</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Room ID</label>
            <Input
              type="number"
              value={formData.maPhong}
              onChange={(e) => handleChange("maPhong", Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Check-in Date
            </label>
            <Input
              type="datetime-local"
              value={formData.ngayDen}
              onChange={(e) => handleChange("ngayDen", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Check-out Date
            </label>
            <Input
              type="datetime-local"
              value={formData.ngayDi}
              onChange={(e) => handleChange("ngayDi", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Number of Guests
            </label>
            <Input
              type="number"
              value={formData.soLuongKhach}
              onChange={(e) =>
                handleChange("soLuongKhach", Number(e.target.value))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
