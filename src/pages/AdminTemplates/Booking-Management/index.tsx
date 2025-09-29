import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  getAllBookingsApi,
  addBookingApi,
  updateBookingApi,
  deleteBookingApi,
} from "@/services/booking.api";
import type { Booking } from "@/interfaces/booking.interface";

export default function BookingManagement() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: getAllBookingsApi,
  });

  const addBooking = useMutation({
    mutationFn: addBookingApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

  const updateBooking = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Booking> }) =>
      updateBookingApi(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

  const deleteBooking = useMutation({
    mutationFn: (id: number) => deleteBookingApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

  const handleAdd = () => {
    console.log("Add booking modal here");
  };

  const handleEdit = (booking: Booking) => {
    console.log("Edit booking modal here:", booking);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      deleteBooking.mutate(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Booking Management</h1>
        <Button onClick={handleAdd}>+ Add Booking</Button>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-4">Loading bookings...</div>
        ) : (
          <table className="w-full table-fixed border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 w-16">ID</th>
                <th className="border p-2 w-32">Room ID</th>
                <th className="border p-2 w-40">Check-in</th>
                <th className="border p-2 w-40">Check-out</th>
                <th className="border p-2 w-24">Guests</th>
                <th className="border p-2 w-32">User ID</th>
                <th className="border p-2 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="border p-2 text-center">{b.id}</td>
                    <td className="border p-2 text-center">{b.maPhong}</td>
                    <td className="border p-2 text-center">{b.ngayDen}</td>
                    <td className="border p-2 text-center">{b.ngayDi}</td>
                    <td className="border p-2 text-center">{b.soLuongKhach}</td>
                    <td className="border p-2 text-center">{b.maNguoiDung}</td>
                    <td className="border p-2 text-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(b)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(b.id)}
                        disabled={deleteBooking.isPending}
                      >
                        {deleteBooking.isPending ? "Deleting..." : "Delete"}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
