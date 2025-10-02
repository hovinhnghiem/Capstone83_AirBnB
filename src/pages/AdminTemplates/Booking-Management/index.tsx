import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAllBookingsApi,
  addBookingApi,
  updateBookingApi,
  deleteBookingApi,
} from "@/services/booking.api";
import AddBookingModal from "../_components/add-booking-modal";
import type { Booking } from "@/interfaces/booking.interface";
import { useState } from "react";

export default function BookingManagement() {
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: getAllBookingsApi,
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
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.maPhong.toString().includes(keyword) ||
      booking.maNguoiDung.toString().includes(keyword)
  );
  const totalPages =
    filteredBookings.length > 0
      ? Math.ceil(filteredBookings.length / pageSize)
      : 1;
  const startIndex = (pageIndex - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageBookings = bookings.slice(startIndex, endIndex);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      deleteBooking.mutate(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Booking Management</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by Room ID, User ID…"
            value={keyword}
            onChange={(e) => {
              setPageIndex(1);
              setKeyword(e.target.value);
            }}
            className="w-64"
          />
          <Button onClick={() => setIsAddOpen(true)}>+ Add Booking</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-4">Loading bookings...</div>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Room ID</th>
                <th className="border p-2">Check-in</th>
                <th className="border p-2">Check-out</th>
                <th className="border p-2">Guests</th>
                <th className="border p-2">User ID</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPageBookings.length > 0 ? (
                currentPageBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="border p-2 text-center">{booking.id}</td>
                    <td className="border p-2 text-center">
                      {booking.maPhong}
                    </td>
                    <td className="border p-2 text-center">
                      {booking.ngayDen}
                    </td>
                    <td className="border p-2 text-center">{booking.ngayDi}</td>
                    <td className="border p-2 text-center">
                      {booking.soLuongKhach}
                    </td>
                    <td className="border p-2 text-center">
                      {booking.maNguoiDung}
                    </td>
                    <td className="border p-2 text-center space-x-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(booking.id)}
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

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex((page) => Math.max(1, page - 1))}
          disabled={pageIndex === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {pageIndex} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex((page) => Math.min(totalPages, page + 1))}
          disabled={pageIndex >= totalPages}
        >
          Next
        </Button>
      </div>
      <AddBookingModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
