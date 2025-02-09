import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../services";
import { REACT_QUERY_KEYS } from "../../../constants/querykeys";
import { notification } from "antd";

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_CATEGORIES],
    queryFn: () => CategoryService.getAllCategories(),
  });
};

export const useGetDetailCategory = (id: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_CATEGORIES, id],
    queryFn: () => CategoryService.getDetailCategory(id),
  });
};

export function useCreateCategory(handleCancel: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CategoryService.createCategory,
    onSuccess: () => {
      notification.success({
        message: <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>Thành công</span>,
        placement: "topRight",
        description: "Thêm mới danh mục thành công",
        showProgress: true,
        duration: 3
      })
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_CATEGORIES],
      });
      handleCancel();
    },
    onError() {
      notification.error({
        message: <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>Thất bại</span>,
        placement: "topRight",
        description: "Thêm mới danh mục thất bại",
        showProgress: true,
        duration: 3
      })
      handleCancel();
    }
  });
}