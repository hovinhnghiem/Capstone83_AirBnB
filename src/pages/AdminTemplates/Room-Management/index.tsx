import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePaginatedRooms } from "@/hooks/paginatedRooms";
import type { Room } from "@/interfaces/room.interface";
import { useState } from "react";
import EditRoomModal from "../_components/edit-room-modal";
import AddRoomModal from "../_components/add-room-modal";
import { Check, X } from "lucide-react";
import { addRoomApi, uploadRoomImageApi } from "@/services/room.api";

export default function RoomManagement() {
  const roomsHook = usePaginatedRooms(5);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Room Management</CardTitle>
          <Button onClick={() => setIsAddOpen(true)}>+ Add Room</Button>
        </CardHeader>
        <CardContent>
          {roomsHook.error && <p className="text-red-500">{roomsHook.error}</p>}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100 text-xs">
                  <th className="border p-2">ID</th>
                  <th className="border p-2 w-64">Room Name</th>
                  <th className="border p-2">Guests</th>
                  <th className="border p-2">Bedrooms</th>
                  <th className="border p-2">Beds</th>
                  <th className="border p-2">Baths</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2 w-64">Description</th>
                  <th className="border p-2">Amenities</th>
                  <th className="border p-2">Location</th>
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roomsHook.isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="text-center animate-pulse">
                        <td colSpan={12} className="border p-2">
                          Loading...
                        </td>
                      </tr>
                    ))
                  : roomsHook.rooms.map((room: Room) => (
                      <tr key={room.id} className="text-center">
                        <td className="border p-2">{room.id}</td>
                        <td
                          className="border p-2 max-w-[100px] truncate"
                          title={room.tenPhong}
                        >
                          {room.tenPhong}
                        </td>
                        <td className="border p-2">{room.khach}</td>
                        <td className="border p-2">{room.phongNgu}</td>
                        <td className="border p-2">{room.giuong}</td>
                        <td className="border p-2">{room.phongTam}</td>
                        <td className="border p-2">${room.giaTien}</td>
                        <td
                          className="border p-2 max-w-[100px] truncate"
                          title={room.moTa}
                        >
                          {room.moTa}
                        </td>

                        {/* Amenities */}
                        <td
                          className="border p-2 max-w-[120px] truncate text-xs"
                          title={`Wifi: ${room.wifi ? "Yes" : "No"}
AC: ${room.dieuHoa ? "Yes" : "No"}
Pool: ${room.hoBoi ? "Yes" : "No"}
Parking: ${room.doXe ? "Yes" : "No"}
TV: ${room.tivi ? "Yes" : "No"}
Kitchen: ${room.bep ? "Yes" : "No"}
Washing: ${room.mayGiat ? "Yes" : "No"}
Iron: ${room.banLa ? "Yes" : "No"}
Clothes Iron: ${room.banUi ? "Yes" : "No"}`}
                        >
                          Wifi:{" "}
                          {room.wifi ? (
                            <Check className="inline w-4 h-4" />
                          ) : (
                            <X className="inline w-4 h-4" />
                          )}{" "}
                          · AC:{" "}
                          {room.dieuHoa ? (
                            <Check className="inline w-4 h-4" />
                          ) : (
                            <X className="inline w-4 h-4" />
                          )}{" "}
                          · Pool:{" "}
                          {room.hoBoi ? (
                            <Check className="inline w-4 h-4" />
                          ) : (
                            <X className="inline w-4 h-4" />
                          )}
                          <br />
                          TV:{" "}
                          {room.tivi ? (
                            <Check className="inline w-4 h-4" />
                          ) : (
                            <X className="inline w-4 h-4" />
                          )}{" "}
                          · Kitchen:{" "}
                          {room.bep ? (
                            <Check className="inline w-4 h-4" />
                          ) : (
                            <X className="inline w-4 h-4" />
                          )}
                          <br />
                          Washing:{" "}
                          {room.mayGiat ? (
                            <Check className="inline w-4 h-4" />
                          ) : (
                            <X className="inline w-4 h-4" />
                          )}{" "}
                          · Iron:{" "}
                          {room.banLa ? (
                            <Check className="inline w-4 h-4" />
                          ) : (
                            <X className="inline w-4 h-4" />
                          )}
                          <br />
                          Clothes Iron:{" "}
                          {room.banUi ? (
                            <Check className="inline w-4 h-4" />
                          ) : (
                            <X className="inline w-4 h-4" />
                          )}
                        </td>

                        <td className="border p-2">{room.maViTri}</td>
                        <td className="border p-2">
                          {room.hinhAnh ? (
                            <img
                              src={room.hinhAnh}
                              alt={room.tenPhong}
                              className="h-16 w-24 object-cover mx-auto rounded"
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td className="border p-2 space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingRoom(room);
                              setIsEditOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={roomsHook.prevPage}
              disabled={roomsHook.pageIndex === 1 || roomsHook.isLoading}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {roomsHook.pageIndex} of {roomsHook.totalPages || "—"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={roomsHook.nextPage}
              disabled={
                roomsHook.pageIndex === roomsHook.totalPages ||
                roomsHook.isLoading
              }
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Modal */}
      <AddRoomModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={roomsHook.refetch}
        onSubmit={async (data, files) => {
          try {
            const newRoom = await addRoomApi(data);

            for (const file of files) {
              await uploadRoomImageApi(newRoom.id, file);
            }

            console.log("Room created successfully");
          } catch (err) {
            console.error("Failed to create room:", err);
          }
        }}
      />

      {/* Edit Modal */}
      <EditRoomModal
        room={editingRoom}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={roomsHook.refetch}
      />
    </div>
  );
}
