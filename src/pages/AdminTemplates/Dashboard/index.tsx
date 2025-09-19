import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  getAllRoomsApi,
  getUsersCountApi,
  getLocationsCountApi,
  getBookingsCountApi,
} from "@/services/room.api";
import type { Room } from "@/interfaces/room.interface";
export default function Dashboard() {
  const roomsQuery = useQuery({
    queryKey: ["rooms"],
    queryFn: getAllRoomsApi,
  });
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsersCountApi,
  });

  const locationsQuery = useQuery({
    queryKey: ["locations"],
    queryFn: getLocationsCountApi,
  });

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookingsCountApi,
  });

  const rooms = roomsQuery.data ?? [];
  const recentRooms = rooms.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Rooms"
          value={roomsQuery.isLoading ? "..." : rooms.length ?? 0}
        />
        <MetricCard
          title="Total Users"
          value={usersQuery.isLoading ? "..." : usersQuery.data ?? 0}
        />
        <MetricCard
          title="Total Locations"
          value={locationsQuery.isLoading ? "..." : locationsQuery.data ?? 0}
        />
        <MetricCard
          title="Total Bookings"
          value={bookingsQuery.isLoading ? "..." : bookingsQuery.data ?? 0}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            {roomsQuery.isLoading ? (
              <p>Loading...</p>
            ) : (
              <ul className="space-y-3">
                {recentRooms.map((room: Room) => (
                  <li
                    key={room.id}
                    className="flex justify-between border-b pb-2 last:border-0"
                  >
                    <span>{room.tenPhong}</span>
                    <span className="font-semibold">${room.giaTien}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">This month’s revenue</p>
            <p className="text-2xl font-semibold mt-2">$18,450</p>
            <div className="mt-4 rounded-xl border p-3 text-center">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
