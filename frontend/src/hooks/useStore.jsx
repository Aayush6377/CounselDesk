import { useContext } from "react";
import StoreContext from '../context/store-context';

export const useStore = () => useContext(StoreContext);
