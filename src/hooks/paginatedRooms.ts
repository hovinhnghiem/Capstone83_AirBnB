import type { Room } from "@/interfaces/room.interface";
import { useState, useEffect, useMemo } from "react";
import { getAllRoomsApi } from "@/services/room.api";

export const usePaginatedRooms = (initialPageSize: number = 5) => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllRoomsApi();
      setRooms(response);
      setPageIndex(1);
    } catch (err: any) {
      setError(err.message || "Failed to fetch rooms");
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    if (!search.trim()) return rooms;
    const lower = search.toLowerCase();
    return rooms.filter(
      (room) =>
        room.tenPhong.toLowerCase().includes(lower) ||
        room.moTa.toLowerCase().includes(lower) ||
        String(room.id).includes(lower)
    );
  }, [rooms, search]);

  const totalPages = Math.ceil(filteredRooms.length / pageSize);

  const nextPage = () => {
    if (pageIndex < totalPages) setPageIndex((prev) => prev + 1);
  };

  const prevPage = () => {
    if (pageIndex > 1) setPageIndex((prev) => prev - 1);
  };

  const paginatedRooms = filteredRooms.slice(
    (pageIndex - 1) * pageSize,
    pageIndex * pageSize
  );

  return {
    rooms: paginatedRooms,
    isLoading,
    error,
    pageIndex,
    pageSize,
    totalRows: filteredRooms.length,
    totalPages,
    nextPage,
    prevPage,
    refetch: fetchRooms,
    setPageIndex,
    search,
    setSearch,
  };
};
