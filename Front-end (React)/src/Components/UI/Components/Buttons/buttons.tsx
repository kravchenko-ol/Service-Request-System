import { useContext } from 'react';
import './buttons.css';
import { ThemContext } from '../../../../Theme/themeContext';
import '../../../../Theme/theme.css'
import type { IButLogReg } from '../../../../Types/type';

export function ThemeButton() {
    const themeObj = useContext(ThemContext);

    function clickTheme() {
        return themeObj?.theme === 'light' ? 
                themeObj.setTheme('dark') : 
                themeObj?.setTheme('light')
    };

    return (
        <>
            <button 
                className='themeBtn' 
                type='button'
                onClick={clickTheme}
            >
                <img src={themeObj?.theme === 'light' ?
                    `${import.meta.env.BASE_URL}/img/icons8-sun-50.png` :
                    `${import.meta.env.BASE_URL}/img/icons8-moon-50.png`
                } alt="" width={30} />
            </button>
        </>
    )
};

export function LogRegistrBtn({text, styleClass, click} : IButLogReg) {
    return (
        <>
            <button 
                type='button' 
                className={styleClass}
                onClick={click}
            >
                {text}
            </button>
        </>
    )
};

export function SubmitBtn({text} : {text: string}) {
    return (
        <>
            <button 
                type='submit'
                className='submitBtn'
            >
                {text}
            </button>
        </>
    )
};

export function BtnOnly({text, click} : {text: string, click: () => void}) {
    return (
        <>
            <button 
                type='button'
                className='submitBtn btnOnly'
                onClick={click}
            >
                {text}
            </button>
        </>
    )
};
