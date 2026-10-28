import React, { useState } from "react";
import type {TTheme } from "../Types/type";
import { ThemContext } from "./themeContext";

export default function ThemeProvider({children} : {children: React.ReactNode}) {
    const [theme, setTheme] = useState<TTheme>('light');

    return (
        <ThemContext value={{theme, setTheme}}>
            {children}
        </ThemContext>
    )
};