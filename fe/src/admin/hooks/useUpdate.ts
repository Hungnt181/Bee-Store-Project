import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";

const useUpdate = (url: string, key: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: object) => {
            await axios.put(`${url}${id}`);
        },
        onSuccess: () => {
            message.success("Cập nhật trạng thái thành công");
            queryClient.invalidateQueries({
                queryKey: [key],
            });
        },
    });
};

export default useUpdate;