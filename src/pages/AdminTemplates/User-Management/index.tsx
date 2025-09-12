import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserApi } from "@/services/auth.api";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string ;
  birthday: string;
  gender: boolean;
  role: "USER" | "ADMIN";
}

export default function UserManagement() {
  const queryClient = useQueryClient();


  const currentUser = JSON.parse(localStorage.getItem("user")!);
  console.log("🔑 Current role:", currentUser?.role);


  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data.content;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedUser: User) =>
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
}
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (isLoading) return <p className="text-center">Loading users...</p>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
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
                {users?.map((user) => (
                  <tr key={user.id} className="text-center text-sm">
                    <td className="border p-2">{user.id}</td>
                    <td className="border p-2 truncate">{user.name}</td>
                    <td className="border p-2 truncate">{user.email}</td>
                    <td className="border p-2">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={user.role}
                        onChange={(e) =>
                          updateMutation.mutate({
                            ...user,
                            role: e.target.value as "USER" | "ADMIN",
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
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(user.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
