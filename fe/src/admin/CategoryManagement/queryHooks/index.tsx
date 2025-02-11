import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../services";
import { REACT_QUERY_KEYS } from "../../../constants/querykeys";
import { notification } from "antd";
import { Category } from "../../../interface/Category";

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
        message: <span style={{ textTransform: "uppercase", fontWeight: "bold", fontSize: "20px", color: "green"  }}>Thành công</span>,
        placement: "topRight",
        description: <span style={{ fontSize: "18px" }}>Thêm mới danh mục thành công</span>,
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
        message: <span style={{ textTransform: "uppercase", fontWeight: "bold", fontSize: "20px", color: "#FF4D4F" }}>Thất bại</span>,
        placement: "topRight",
        description: <span style={{ fontSize: "18px" }}>{error.message}</span>,
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
        message: <span style={{ textTransform: "uppercase", fontWeight: "bold", fontSize: "20px", color: "#52C41A"  }}>Thành công</span>,
        placement: "topRight",
        description: <span style={{ fontSize: "18px" }}>Cập nhật danh mục thành công</span>,
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
        message: <span style={{ textTransform: "uppercase", fontWeight: "bold", fontSize: "20px", color: "#FF4D4F" }}>Thất bại</span>,
        placement: "topRight",
        description: <span style={{ fontSize: "18px" }}>{error.message}</span>,
        showProgress: true,
        duration: 3
      })
      handleCancel();
    }
  });
};

