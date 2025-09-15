import { useState } from "react";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import api from "@/services/api";
import type { CurrentUser } from "@/interfaces/auth.interface";

export type UserListItem = Omit<CurrentUser, "accessToken" | "password">;

interface PaginatedUsers {
  items: UserListItem[];
  totalPages: number;
  totalItems: number;
}

export function usePaginatedUsers(limit: number = 5, keyword: string = "") {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<PaginatedUsers>({
    queryKey: ["users", page, limit, keyword],
    queryFn: async () => {
      const response = await api.get("/users/phan-trang-tim-kiem", {
        params: {
          pageIndex: page,
          pageSize: limit,
          keyword,
        },
      });

      const raw = response.data.content;

      return {
        items: raw.data ?? [],
        totalPages: Math.ceil((raw.totalRow ?? 0) / (raw.pageSize ?? limit)),
        totalItems: raw.totalRow ?? 0,
      };
    },
    placeholderData: keepPreviousData,
  });

  return {
    users: data?.items ?? [],
    totalPages: data?.totalPages ?? 1,
    totalItems: data?.totalItems ?? 0,
    page,
    setPage,
    isLoading,
    isError,
    queryClient,
  };
}
