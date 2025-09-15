import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RoomManagement() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Room Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="border p-2 w-16">ID</th>
                  <th className="border p-2 w-40">Room Name</th>
                  <th className="border p-2 w-32">Price</th>
                  <th className="border p-2 w-32">Status</th>
                  <th className="border p-2 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="text-center text-sm">
                    <td className="border p-2">—</td>
                    <td className="border p-2 truncate">Loading...</td>
                    <td className="border p-2">—</td>
                    <td className="border p-2">—</td>
                    <td className="border p-2 space-x-2">
                      <Button size="sm" variant="outline" disabled>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" disabled>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <span className="text-sm">Page 1 of X</span>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
