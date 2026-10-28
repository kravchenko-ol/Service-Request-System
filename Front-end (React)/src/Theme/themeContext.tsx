import { createContext } from "react";
import type { ITheme } from "../Types/type";

export const ThemContext = createContext<ITheme | null>(null);