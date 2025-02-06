/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetDetail =  <T>(url:string, key:string,id : string) => {
  return useQuery({
      queryKey: [key, id],
      queryFn: async () => {
        try {
          const { data } = await axios.get(
            url
          );
          return data.variants.map((item:   T & { _id: string }) => ({
            ...item,
            key: item._id,
          }));
        } catch (error) {
          return console.log(error);
        }
      },
    });
};

export default useGetDetail;


