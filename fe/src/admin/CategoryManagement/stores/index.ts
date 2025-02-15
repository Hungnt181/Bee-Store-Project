import { create } from "zustand";
import { Category } from "../../../interface/Category";

export interface ICategoryStore {
  actionMode: boolean;
  cateDetail: Category;
  isValuesChanged: boolean;
  setActionMode: (mode: boolean) => void;
  setCateDetail: (item: Category) => void;
  setIsValuesChange: (changed: boolean) => void;
  resetCateStore: () => void;
}
const useCateStore = create<ICategoryStore>((set) => ({
  actionMode: false,
  cateDetail: {} as Category,
  isValuesChanged: false,
   setActionMode: (mode) => set(() => ({actionMode: mode})),
   setCateDetail: (data: Category) => set(() => ({cateDetail: data})),
   setIsValuesChange: (changed) => set(() => ({isValuesChanged: changed})),
   resetCateStore: () => set(() => ({
    actionMode: false,
    isValuesChanged: false,
    cateDetail: {} as Category,
   }))
}))

export default useCateStore