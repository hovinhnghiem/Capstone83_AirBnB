import { Button } from "@/components/ui/button";

export default function LocationManagement() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Location Management</h1>
        <Button>+ Add Location</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 w-16">ID</th>
              <th className="border p-2 w-40">Name</th>
              <th className="border p-2 w-40">City</th>
              <th className="border p-2 w-40">Country</th>
              <th className="border p-2 w-40">Image</th>
              <th className="border p-2 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 text-center">1</td>
              <td className="border p-2 text-center">Hà Nội</td>
              <td className="border p-2 text-center">Hà Nội</td>
              <td className="border p-2 text-center">Việt Nam</td>
              <td className="border p-2 text-center">
                <img
                  src="https://via.placeholder.com/100"
                  alt="location"
                  className="h-16 w-full object-cover rounded"
                />
              </td>
              <td className="border p-2 text-center space-x-2">
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" variant="destructive">
                  Delete
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
