import { useMutation } from "@tanstack/react-query";
import { updateUserApi } from "@/services/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { usePaginatedUsers } from "@/hooks/paginatedUsers";
import type { CurrentUser } from "@/interfaces/auth.interface";
import { useState } from "react";
import { deleteUserApi } from "@/services/auth.api";
import AddUserModal from "../_components/add-user-modal";
import EditUserModal from "../_components/edit-user-modal";

type UserListItem = Omit<CurrentUser, "password" | "accessToken">;

export default function UserManagement() {
  const [keyword, setKeyword] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const { users, page, setPage, totalPages, isLoading, queryClient } =
    usePaginatedUsers(5, keyword);

  const updateMutation = useMutation({
    mutationFn: (updatedUser: UserListItem) =>
      updateUserApi(updatedUser.id, updatedUser),
    onSuccess: (serverUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      const meRaw = localStorage.getItem("user");
      if (meRaw && serverUser) {
        const me = JSON.parse(meRaw);
        if (me.email === serverUser.email) {
          const nextUser = { ...me, role: serverUser.role };
          localStorage.setItem("user", JSON.stringify(nextUser));
        }
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUserApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (isLoading) return <p className="text-center">Loading users...</p>;

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle>User Management</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by name or email…"
              value={keyword}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPage(1);
                setKeyword(event.target.value);
              }}
              className="w-64"
            />
            <Button variant="outline" onClick={() => setKeyword("")}>
              Clear
            </Button>
            <Button onClick={() => setIsAddOpen(true)}>+ Add User</Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="border p-2 w-16">ID</th>
                  <th className="border p-2 w-32">Name</th>
                  <th className="border p-2 w-64">Email</th>
                  <th className="border p-2 w-24">Role</th>
                  <th className="border p-2 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="text-center text-sm">
                    <td className="border p-2">{user.id}</td>
                    <td className="border p-2 truncate">{user.name}</td>
                    <td className="border p-2 truncate">{user.email}</td>
                    <td className="border p-2">
                      <select
                        className="px-2 pr-6 py-1 rounded-md border text-sm bg-white appearance-none focus:ring-2 focus:ring-blue-500"
                        value={user.role}
                        onChange={(event) =>
                          updateMutation.mutate({
                            ...user,
                            role: event.target.value as "USER" | "ADMIN",
                          })
                        }
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="border p-2 space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingUser(user);
                          setIsEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this user?"
                            )
                          ) {
                            deleteMutation.mutate(user.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
      <AddUserModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
      />
      <EditUserModal
        user={editingUser}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
      />
    </div>
  );
}
