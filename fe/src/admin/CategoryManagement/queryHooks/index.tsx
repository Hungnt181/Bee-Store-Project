import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../services";
import { REACT_QUERY_KEYS } from "../../../constants/querykeys";
import { notification } from "antd";
import { Category } from "../../../interface/Category";

export const useGetAllCategories = (param: string) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_CATEGORIES, param],
    queryFn: () => CategoryService.getAllCategories(param),
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
        message: <span>Thêm mới danh mục thành công</span>,
        placement: "topRight",
        showProgress: true,
        duration: 3
      })
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_CATEGORIES],
      });
      handleCancel();
    },
    onError(error) {
      notification.error({
        message: <span>{error.message}</span>,
        placement: "topRight",
        showProgress: true,
        duration: 3
      })
      handleCancel();
    }
  });
};

export function useUpdateCategory(handleCancel: () => void, data: Category, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>  CategoryService.updateCategory(data, id),
    onSuccess: () => {
      notification.success({
        message: <span >Cập nhật danh mục thành công</span>,
        placement: "topRight",
        showProgress: true,
        duration: 3
      })
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_ALL_CATEGORIES],
      });
      handleCancel();
    },
    onError(error) {
      notification.error({
        message: <span>{error.message}</span>,
        placement: "topRight",
        showProgress: true,
        duration: 3
      })
      handleCancel();
    }
  });
};

