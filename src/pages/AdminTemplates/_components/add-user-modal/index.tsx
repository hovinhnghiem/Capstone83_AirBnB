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
import { useMutation } from "@tanstack/react-query";
import { addUserApi } from "@/services/auth.api";
import type { AddUserValues } from "@/interfaces/user.interface";
import { useQueryClient } from "@tanstack/react-query";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<AddUserValues>({
    name: "",
    email: "",
    password: "",
    phone: "",
    birthday: "",
    gender: false,
    role: "USER",
  });
  const mutation = useMutation({
    mutationFn: addUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      resetForm();
      onClose();
    },
  });
  const handleChange = (key: keyof AddUserValues, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      birthday: "",
      gender: true,
      role: "USER",
    });
  };
  const handleSubmit = () => {
    mutation.mutate(formData);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <Input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <Input
            type="date"
            value={formData.birthday}
            onChange={(e) => handleChange("birthday", e.target.value)}
          />
          <select
            value={formData.gender ? "male" : "female"}
            onChange={(e) => handleChange("gender", e.target.value === "male")}
            className="w-full border p-2 rounded"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select
            value={formData.role}
            onChange={(e) =>
              handleChange("role", e.target.value as "ADMIN" | "USER")
            }
            className="w-full border p-2 rounded"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Adding..." : "Add User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
