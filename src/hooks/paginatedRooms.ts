import type { Room } from "@/interfaces/room.interface";
import { useState, useEffect } from "react";
import { getAllRoomsApi } from "@/services/room.api";

export const usePaginatedRooms = (initialPageSize: number = 5) => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalRows, setTotalRows] = useState(0);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllRoomsApi();
      setRooms(response);
      setTotalRows(response.length);
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

  const totalPages = Math.ceil(totalRows / pageSize);

  const nextPage = () => {
    if (pageIndex < totalPages) {
      setPageIndex((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (pageIndex > 1) {
      setPageIndex((prev) => prev - 1);
    }
  };

  const paginatedRooms = rooms.slice(
    (pageIndex - 1) * pageSize,
    pageIndex * pageSize
  );

  return {
    rooms: paginatedRooms,
    isLoading,
    error,
    pageIndex,
    pageSize,
    totalRows,
    totalPages,
    nextPage,
    prevPage,
    setPageIndex,
    refetch: fetchRooms,
  };
};
