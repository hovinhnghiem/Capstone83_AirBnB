import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { updateUserApi } from "@/services/auth.api";
import type { User } from "@/interfaces/user.interface";

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUserModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const [form, setForm] = useState<User | null>(user);

  useEffect(() => {
    setForm(user);
  }, [user]);

  if (!form) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) =>
        prev
          ? { ...prev, [name]: (e.target as HTMLInputElement).checked }
          : prev
      );
    } else {
      setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    try {
      const updated = await updateUserApi(form.id, form);
      if (updated) {
        alert(" User updated successfully!");
        onSuccess();
        onClose();
      } else {
        alert(" Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert(" Error updating user.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Leave blank to keep current"
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <Input
              id="phone"
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="birthday" className="text-sm font-medium">
              Birthday
            </label>
            <Input
              id="birthday"
              name="birthday"
              type="date"
              value={form.birthday || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="gender" className="text-sm font-medium">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={form.gender ? "true" : "false"}
              onChange={(e) =>
                setForm((prev) =>
                  prev ? { ...prev, gender: e.target.value === "true" } : prev
                )
              }
              className="w-full border rounded-md px-2 py-1"
            >
              <option value="true">Female</option>
              <option value="false">Male</option>
            </select>
          </div>

          <div>
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-md px-2 py-1"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
