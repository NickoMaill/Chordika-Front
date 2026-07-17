// #region IMPORTS -> /////////////////////////////////////
import { JSX, MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';
import AppMenuList, { MenuListOptionType } from './AppMenuList';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
type Position = {
    top: number;
    left: number;
};
// #endregion SINGLETON --> /////////////////////////////////

export default function AppRightClickMenu({ children, menuList }: IAppRightClickMenu): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState<Position | null>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleContextMenu = (event: MouseEvent<HTMLDivElement>): void => {
        event.preventDefault();
        event.stopPropagation();

        setMenuPosition({
            left: event.clientX,
            top: event.clientY,
        });
    };

    useEffect(() => {
        const handleClick = (): void => {
            setMenuPosition(null);
        };
        document.addEventListener('click', handleClick);
        return (): void => {
            document.removeEventListener('click', handleClick);
        };
    }, []);
    // #endregion METHODS --> //////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <div ref={wrapperRef} onContextMenu={handleContextMenu}>
            <AppMenuList anchorPosition={menuPosition} options={menuList} anchorComponent={() => null} />
            {children}
        </div>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS --> //////////////////////////////////////
interface IAppRightClickMenu {
    menuList: MenuListOptionType[];
    children: ReactNode;
}
// #endregion IPROPS --> ///////////////////////////////////
