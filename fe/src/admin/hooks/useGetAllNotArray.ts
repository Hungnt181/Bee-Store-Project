/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetAllNotArray =  <T>(url:string, key:string) => {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      try {
        const { data } = await axios.get(url);
        return data.data.map((item:   T & { _id: string }) => ({
          ...item,
          key: item._id,
        }));
      } catch (error) {
        return console.log(error);
      }
    },
  });
};

export default useGetAllNotArray;


