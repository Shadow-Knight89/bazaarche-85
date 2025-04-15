
import { createContext } from "react";
import { ProductContextType } from "./types";

// Create the context with default values
export const ProductContext = createContext<ProductContextType>({} as ProductContextType);
