// #region IMPORTS -> /////////////////////////////////////
import { move } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { ComponentPropsWithoutRef, ComponentType, ElementType, JSX } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
export interface IAppDnDListItem<TData> {
    id: number | string;
    index: number;
    data: TData;
}

export interface IAppDnDListItemComponentProps<TData> {
    data: TData;
}
// #endregion SINGLETON --> /////////////////////////////////

export default function AppDnDList<TData, TContainer extends ElementType = 'div'>({
    list,
    itemComponent: ItemComponent,
    containerComponent,
    containerProps,
    onDragEnd,
}: IAppDnDList<TData, TContainer>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const Container = containerComponent ?? 'div';

    const handleDragEnd = (event: Parameters<ComponentPropsWithoutRef<typeof DragDropProvider>['onDragEnd']>[0]): void => {
        const updatedList = move(list, event).map((item, index) => ({
            ...item,
            index,
        }));

        onDragEnd(updatedList);
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <DragDropProvider onDragEnd={handleDragEnd}>
            <Container {...containerProps}>
                {list.map((item, index) => (
                    <AppDnDListItem key={item.id} item={{ ...item, index }} itemComponent={ItemComponent} />
                ))}
            </Container>
        </DragDropProvider>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

function AppDnDListItem<TData>({ item, itemComponent: ItemComponent }: IAppDnDListItemProps<TData>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { ref, isDragging, isDropTarget } = useSortable({ id: item.id, index: item.index });
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <div
            ref={ref}
            style={{
                opacity: isDragging ? 0.5 : 1,
                background: isDropTarget ? 'rgba(0, 0, 0, 0.05)' : undefined,
                cursor: 'grab',
            }}
        >
            <ItemComponent data={item.data} />
        </div>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppDnDList<TData, TContainer extends ElementType> {
    list: IAppDnDListItem<TData>[];
    itemComponent: ComponentType<IAppDnDListItemComponentProps<TData>>;
    containerComponent?: TContainer;
    containerProps?: Omit<ComponentPropsWithoutRef<TContainer>, 'children'>;
    onDragEnd: (list: IAppDnDListItem<TData>[]) => void;
}

interface IAppDnDListItemProps<TData> {
    item: IAppDnDListItem<TData>;
    itemComponent: ComponentType<IAppDnDListItemComponentProps<TData>>;
}
// #endregion IPROPS --> //////////////////////////////////
