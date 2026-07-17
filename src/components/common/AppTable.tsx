// #region IMPORTS -> /////////////////////////////////////
import {
    DataGrid,
    GridCallbackDetails,
    GridColDef,
    GridColType,
    GridPaginationModel,
    useGridApiContext,
    GridAlignment,
    GridRowParams,
    GridActionsCellItemProps,
    GridLocaleText,
    GridRenderCellParams,
    GridTreeNodeWithRender,
    GridSortModel,
    GridRowSelectionModel,
    GridEventListener,
    useGridSelector,
    gridPageCountSelector,
    Toolbar,
    ColumnsPanelTrigger,
    ToolbarButton,
    GridDensity,
    gridDensitySelector,
    gridClasses,
} from '@mui/x-data-grid';
import { QueryResult } from '~/types/serverCoreType';
import { isValidElement, lazy, MouseEvent, MouseEventHandler, ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import useNavigation from '~/hooks/useNavigation';
import { LevelAccessEnum } from '~/models/Session';
import useResources from '~/hooks/useResources';
import { Bold } from './Text';
import NoData from '~/assets/svg/no-data.svg';
import Error from '~/assets/svg/error.svg';
import { Link } from 'react-router-dom';
import AppImage from './AppImage';
import { JSX } from 'react';
import { IconNameType } from '~/components/common/AppIcon';
import { MenuDivider } from 'mui-tiptap';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { styled, SxProps } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import MuiPagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { TablePaginationProps } from '@mui/material/TablePagination';
import dayjs from 'dayjs';
import { startProgress } from '~/helpers/progressHelper';
import HTMLParser from './HTMLParser';
import { Theme } from '@emotion/react';
import useSearchContext from '~/context/searchContext';
import { ICenterBase } from '~/types/centerType';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////
export type OverrideListPropsType<T> = { baseProps?: ICenterBase; tableProps?: IAppTable<T> };
//#region Types
export type AppTableStructure<T = object> = {
    OverrideComponent?: (props?: OverrideListPropsType<T>) => JSX.Element;
    SideComponent?: () => JSX.Element;
    colStruct: AppGridColDef<T>[];
    actions?: (ActionsType | CustomActionsDef<T>)[];
    actionToShow?: (e: GridRowParams<T>) => number[];
    defaultSort?: AppGridSortModel<T>;
    bulkUpdate?: boolean;
    bulkNew?: boolean;
};

export type AppGridSortModel<T> = {
    field: keyof T;
    sort: 'asc' | 'desc';
};

export type AppGridColDef<T = object> = {
    headerField: keyof T;
    headerLabel: string;
    type: AppTableColType;
    sortable: boolean;
    isEditable?: boolean;
    customCell?: (e: GridRenderCellParams<unknown, unknown, unknown, GridTreeNodeWithRender>) => JSX.Element;
    headerClassName?: string;
    cellClassName?: string;
    align?: GridAlignment;
    headerAlign?: GridAlignment;
    cellSx?: SxProps<Theme>;
    width?: number;
    minWidth?: number;
    format?: string;
    defaultSorted?: boolean;
    defaultSortedOrder?: 'desc' | 'asc';
    pictureUrl?: string;
    valueFormatter?: (e: unknown) => string | JSX.Element;
    actions?: (e: GridRowParams<T>) => ReactElement<GridActionsCellItemProps>[];
};

export type AppTableColType = GridColType | 'checkbox' | 'rating' | 'picture' | 'html';

export type ActionsType = 'view' | 'delete' | 'update';
//#endregion

//#region Main Function
export default function AppTable<T>({
    columns,
    rows,
    isTableLoading = true,
    isRowsCheckable = false,
    onSort,
    rowsPerPage = 50,
    onPaginationChange,
    onPageChange,
    currentPage,
    actions,
    actionToShow,
    onExportClick,
    entity,
    onAllRowSelect,
    isAllRowSelected,
    onRowSelect,
    allowExport,
    isError = false,
    errorMessage,
    onBulkAddClick,
    onBulkUpdateClick,
    onBulkDeleteClick,
    additionalTableAction = [],
    isMini = false,
    basePath,
    // onRowClick,
}: IAppTable<T>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [loadingMap, setLoadingMap] = useState<Record<string | number, boolean>>({});
    // #endregion STATE --> ////////////////////////////////////

    // #region SINGLETON --> ////////////////////////////////////
    const { translate } = useResources();
    const tableLocalText: Partial<GridLocaleText> = {
        columnMenuShowColumns: translate('common.table.columns.showAll'),
        columnsManagementNoColumns: translate('common.table.columns.hideAll') as string,
        filterPanelInputPlaceholder: translate('common.table.columns.placeholder') as string,
        filterPanelInputLabel: translate('common.table.columns.search') as string,
        toolbarColumns: translate('common.table.columns.plural'),
        toolbarDensity: translate('common.table.columns.density'),
        toolbarDensityComfortable: translate('common.table.columns.comfortable') as string,
        toolbarDensityCompact: translate('common.table.columns.skinny') as string,
        toolbarDensityStandard: translate('common.table.columns.regular') as string,
        toolbarDensityLabel: translate('common.table.columns.density') as string,
        footerRowSelected: (count) => {
            const linesCount = isAllRowSelected ? rows.totalRecords : count;
            return `${linesCount} ${translate('common.table.columns.selectedLines', { isPlural: linesCount > 1 ? 's' : '' })}`;
        },
        columnMenuSortAsc: translate('common.table.filter.sortAsc'),
        columnMenuSortDesc: translate('common.table.filter.sortDesc'),
        columnMenuFilter: translate('common.table.filter.label'),
        columnMenuHideColumn: translate('common.table.filter.hideColumns'),
        columnMenuManageColumns: translate('common.table.filter.manageColumns'),
        columnsManagementSearchTitle: 'Rechercher',
        columnsManagementReset: 'Réinitialiser',
        paginationRowsPerPage: 'Résultats par pages',
        columnsManagementShowHideAllText: 'Afficher/Masquer tout',
        paginationDisplayedRows: () => ' ',
    };
    //const minWidth = 223;
    // #endregion SINGLETON --> /////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Nav = useNavigation();
    const { sortedBy, setSortedBy } = useSearchContext();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const getSortModel = (): GridSortModel => {
        if (sortedBy?.sortField) {
            return [{ field: sortedBy?.sortField, sort: sortedBy?.order }];
        } else {
            return [];
        }
    };

    const getGridColumnType = (type: AppTableColType): GridColType => {
        switch (type) {
            case 'date':
            case 'dateTime':
            case 'number':
            case 'string':
                return type;
            default:
                return 'string';
        }
    };

    const getDefaultFormattedValue = (col: AppGridColDef<T>, value: unknown): string => {
        const dateValue = value as string | number | Date | null | undefined;

        switch (col.type) {
            case 'date': {
                if ((value ?? '') === '') {
                    return '';
                }

                if (col.format) {
                    return dayjs(dateValue).format(col.format);
                }

                return dayjs(dateValue).format('DD/MM/YYYY');
            }
            case 'dateTime': {
                return (value ?? '') === '' ? '' : dayjs(dateValue).format('DD/MM/YYYY HH:mm:ss');
            }
            default: {
                return value === null || value === undefined ? '' : String(value);
            }
        }
    };

    const getDefaultCellContent = (col: AppGridColDef<T>, value: unknown): ReactNode => {
        switch (col.type) {
            case 'rating': {
                return <Rating value={Number(value) / 2} readOnly />;
            }
            case 'html': {
                return <HTMLParser>{String(value ?? '')}</HTMLParser>;
            }
            case 'picture': {
                return value ? (
                    <Box className="d-flex align-items-center h-100">
                        <AppImage
                            src={`${col.pictureUrl}/${value}`}
                            alt="image"
                            title={String(value)}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
                        />
                    </Box>
                ) : (
                    '-'
                );
            }
            case 'boolean':
            case 'checkbox': {
                return value ? <AppIcon name="CheckBoxRounded" /> : <AppIcon name="CheckBoxOutlineBlankRounded" />;
            }
            default: {
                return getDefaultFormattedValue(col, value);
            }
        }
    };

    const mapToGridColDef = (columns: AppGridColDef<T>[]): GridColDef[] => {
        const gotHtml = columns.findIndex((c) => c.type === 'html') > -1;
        const cols = columns.map((col) => {
            return {
                field: col.headerField,
                headerName: col.headerLabel,
                sortable: isMini ? false : col.sortable,
                flex: isMini ? null : col.width ? null : 1,
                width: col.width ? col.width : null,
                minWidth: col.minWidth ? col.minWidth : col.width ? null : 150,
                type: getGridColumnType(col.type),
                display: 'text',
                headerClassName: col.headerClassName,
                cellClassName: col.cellClassName,
                align: col.align ? col.align : 'left',
                headerAlign: col.headerAlign ? col.headerAlign : 'left',
                editable: col.isEditable,
                filterable: false,
                renderHeader: (): JSX.Element => <Bold>{col.headerLabel}</Bold>,
                valueFormatter: (e): string => {
                    if (col.valueFormatter) {
                        if (col.type === 'date' && new Date(e).getFullYear() === 1) {
                            return ' ';
                        } else {
                            const formattedValue = col.valueFormatter(e);
                            return typeof formattedValue === 'string' ? formattedValue : '';
                        }
                    } else {
                        return getDefaultFormattedValue(col, e);
                    }
                },
                renderCell: (e): JSX.Element => {
                    if (col.customCell) {
                        return <col.customCell {...e} />;
                    } else {
                        const customFormattedValue = col.valueFormatter?.(e.value);
                        const content =
                            customFormattedValue !== undefined
                                ? isValidElement(customFormattedValue)
                                    ? customFormattedValue
                                    : customFormattedValue || e.formattedValue || e.value
                                : getDefaultCellContent(col, e.value);
                        const stylesCell: SxProps<Theme> = {
                            ...col.cellSx,
                        };
                        stylesCell['height'] = '100%';
                        stylesCell['display'] = 'flex';
                        stylesCell['alignItems'] = 'center';
                        stylesCell['justifyContent'] = 'flex-start';
                        stylesCell['whiteSpace'] = 'nowrap';
                        stylesCell['ligneHeight'] = 1.4;
                        return (
                            <Box className={col.cellClassName ?? '' + (gotHtml ? ' p-1' : '')} sx={{ ...stylesCell }}>
                                {content}
                            </Box>
                        );
                    }
                },
            };
        }) as GridColDef[];
        if (actions) {
            const actionsData: GridColDef = {
                field: 'actions',
                type: 'actions',
                headerClassName: 'fw-bold ',
                flex: 1,
                minWidth: 150,
                resizable: false,
                align: 'right',
                headerAlign: 'right',
                headerName: 'Actions',
                renderHeader: () => <strong>{'Actions'}</strong>,
                getActions: (e) => {
                    let act: (ActionsType | CustomActionsDef<T>)[] = [];
                    if (actionToShow) {
                        const toShow = actionToShow(e);
                        toShow.forEach((i) => {
                            act.push(actions[i]);
                        });
                    } else {
                        act = actions;
                    }
                    return act.map((a) => {
                        if (typeof a === 'string') {
                            return <ActionTable type={a as ActionsType} entity={entity} id={e.row.id} basePath={basePath} key={e.row.id} />;
                        } else {
                            const rowId = e.row.id;
                            const loading = loadingMap[rowId] || false;
                            return (
                                <Tooltip className="mx-1" title={a.title}>
                                    <IconButton
                                        outline="true"
                                        className="p-1"
                                        loading={loading}
                                        size="large"
                                        color="inherit"
                                        onClick={async () => {
                                            setLoadingMap((prev) => ({ ...prev, [rowId]: true }));
                                            try {
                                                await a.onClick(e);
                                            } finally {
                                                setLoadingMap((prev) => ({ ...prev, [rowId]: false }));
                                            }
                                        }}
                                    >
                                        <AppIcon size="small" name={a.icon} />
                                    </IconButton>
                                </Tooltip>
                            );
                        }
                    });
                },
            };
            cols.push(actionsData);
        }
        return cols;
    };

    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        setLoadingMap({});
    }, [rows]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box
            sx={{
                mt: 2,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minHeight: isMini ? 320 : 520,
            }}
        >
            <DataGrid
                sx={{
                    '--DataGrid-overlayHeight': '100px',
                    flex: 1,
                    minHeight: '100%',
                    '.MuiDataGrid-cell:focus': {
                        outline: 'none',
                    },
                    '& .MuiDataGrid-row:hover': {
                        cursor: isMini ? 'inherit' : 'pointer',
                    },
                    '.MuiDataGrid-actionsCell': {
                        gridGap: 0,
                        padding: 0,
                    },
                    // '.MuiIconButton-root': {
                    //     padding: 0.3,
                    // },
                    '.MuiDataGrid-main': {
                        // maxWidth: '205ch',
                        overflow: 'auto',
                    },
                    padding: 0,
                    '.MuiDataGrid-row': {
                        minHeight: '0!important',
                        maxHeight: 'fit-content!important',
                    },
                    '& .MuiBox-root.css-0': {
                        height: '100%',
                    },
                    [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                        outline: 'transparent',
                    },
                    [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
                        outline: 'none !important',
                        boxShadow: 'inset 0 0 0 2px rgba(25, 118, 210, 0.5)',
                        zIndex: 'auto',
                    },
                    [`& .${gridClasses.row}:hover`]: {
                        cursor: isMini ? 'auto' : 'cursor',
                    },
                }}
                rows={!isTableLoading && rows ? rows.records : []}
                density={isMini ? 'compact' : undefined}
                columns={mapToGridColDef(columns.colStruct)}
                rowCount={!isTableLoading && rows ? rows.totalRecords : 0}
                loading={isTableLoading}
                onRowClick={
                    isMini
                        ? null
                        : (e): void =>
                              actions.includes('update') ? Nav.navigateByPath(`${basePath ?? `/center/${entity}`}/${e.id}/update`) : Nav.navigateByPath(`${basePath ?? `/center/${entity}`}/${e.id}`)
                }
                sortingMode="server"
                getRowHeight={() => (columns.colStruct.findIndex((c) => c.type === 'html') > -1 ? 'auto' : undefined)}
                filterMode="server"
                paginationMode="server"
                disableRowSelectionOnClick
                sortingOrder={['asc', 'desc']}
                showToolbar={!isMini}
                sortModel={getSortModel()}
                onSortModelChange={(e) => {
                    if (e.length > 0) {
                        onSort(e[0].field + ' ' + e[0].sort.toUpperCase());
                        columns.colStruct.forEach((col) => {
                            if ((col.headerField as string).toLocaleLowerCase() === e[0].field.toLocaleLowerCase()) {
                                setSortedBy({ sortField: e[0].field, sortLabel: col.headerLabel, order: e[0].sort });
                            }
                        });
                    }
                }}
                pagination
                slots={{
                    noRowsOverlay: () => CustomNoRowsOverlay({ isError, errorMessage }),
                    toolbar: isMini
                        ? null
                        : (): JSX.Element => CustomToolBar({ onExportClick, allowExport, onBulkAddClick, onBulkUpdateClick, onBulkDeleteClick, additionalActions: additionalTableAction }),
                }}
                localeText={tableLocalText}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: isMini ? 10 : rowsPerPage },
                    },
                    sorting: {
                        sortModel: columns.defaultSort ? ([columns.defaultSort] as GridSortModel) : null,
                    },
                }}
                slotProps={{
                    loadingOverlay: {
                        variant: 'skeleton',
                        noRowsVariant: 'skeleton',
                    },
                    basePagination: {
                        onPageChange: (_, n) => onPageChange(n),
                        rowsPerPage: rowsPerPage,
                        page: currentPage,
                        material: {
                            ActionsComponent: Pagination,
                        },
                    },
                    pagination: {
                        labelRowsPerPage: translate('common.table.nav.resultPerPage'),
                        labelDisplayedRows: () => null,
                    },
                    baseCheckbox: {
                        onClick: (e) => {
                            if ((e.target as HTMLElement).ariaLabel === 'Select all rows') {
                                onAllRowSelect(true);
                            } else {
                                onAllRowSelect(false);
                            }
                        },
                    },
                }}
                pageSizeOptions={isMini ? [10] : [5, 10, 25, 50]}
                onPaginationModelChange={onPaginationChange}
                checkboxSelection={isRowsCheckable}
                onRowSelectionModelChange={(e) => onRowSelect(e)}
            />
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////x
}
// #region IPROPS -->  /////////////////////////////////////
export interface IAppTable<T> {
    columns: AppTableStructure<T>;
    isTableLoading?: boolean;
    isRowsCheckable?: boolean;
    rows: QueryResult<T>;
    onSort?: (e: string) => void;
    currentPage?: number;
    onPageChange?: (p: number) => void;
    onPaginationChange?: (e: GridPaginationModel, details: GridCallbackDetails) => void;
    rowsPerPage?: number;
    entity?: string;
    authorizeExport?: LevelAccessEnum;
    onExportClick?: (e: 'csv' | 'xlsx') => void;
    onAllRowSelect?: (isAllSelected: boolean) => void;
    onRowSelect?: (ids: GridRowSelectionModel) => void;
    onRowClick?: GridEventListener<'rowClick'>;
    isAllRowSelected?: boolean;
    actions?: (ActionsType | CustomActionsDef<T>)[];
    actionToShow?: (e: GridRowParams<T>) => number[];
    allowExport?: boolean;
    isError?: boolean;
    errorMessage?: string;
    onBulkAddClick?: () => void;
    onBulkUpdateClick?: () => void;
    onBulkDeleteClick?: () => void;
    additionalTableAction?: CustomTableAction[];
    isMini?: boolean;
    basePath?: string;
}

export type CustomActionsDef<T> = {
    icon: IconNameType;
    onClick: (e: GridRowParams<T>) => Promise<void>;
    title: string;
    isLoading?: boolean;
    blank?: boolean;
};

export type CustomTableAction = { label: string; onClick: () => void; icon: IconNameType };
// #endregion IPROPS --> //////////////////////////////////

function CustomNoRowsOverlay({ isError = false, errorMessage }: { isError?: boolean; errorMessage?: string }): JSX.Element {
    const StyledGridOverlay = styled('div')(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        '& .MuiDataGrid-overlayWrapper': {
            height: 200,
        },
        '& .ant-empty-img-1': {
            fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
        },
        '& .ant-empty-img-2': {
            fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
        },
        '& .ant-empty-img-3': {
            fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
        },
        '& .ant-empty-img-4': {
            fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
        },
        '& .ant-empty-img-5': {
            fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
            fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
        },
    }));
    return (
        <StyledGridOverlay>
            {isError ? <img src={Error} width={120} /> : <img src={NoData} width={120} />}
            <Box sx={{ mt: 1, fontWeight: 'bold' }}>{isError ? errorMessage : 'Aucun résultats dans la base...'}</Box>
        </StyledGridOverlay>
    );
}

function ActionTable({ type, id, entity, basePath }: IActionTable): JSX.Element {
    const getLabel = (): { label: string; icon: IconNameType } => {
        switch (type) {
            case 'delete':
                return { label: 'Supprimer', icon: 'Delete' };
            case 'update':
                return { label: 'Modifier', icon: 'Edit' };
            default:
                return { label: 'Visualiser', icon: 'RemoveRedEye' };
        }
    };
    return (
        <Tooltip className="mx-1" title={getLabel().label}>
            <IconButton
                outline="true"
                size="large"
                className="p-1"
                component={Link}
                onClick={startProgress}
                to={`${basePath ?? `/center/${entity}`}/${id}${type !== 'view' ? `/${type}` : ''}`}
                color="inherit"
            >
                <AppIcon size="small" name={getLabel().icon} />
            </IconButton>
        </Tooltip>
    );
}
interface IActionTable {
    type: ActionsType;
    id: string | number;
    entity: string;
    isMini?: boolean;
    basePath?: string;
}
//#endregion
//#endregion
function CustomToolBar({ onExportClick, allowExport, onBulkAddClick, onBulkUpdateClick, onBulkDeleteClick, additionalActions = [] }: ICustomToolBar): JSX.Element {
    return (
        <Toolbar>
            <PanelTooltip />
            <DensityTooltip />
            <MenuDivider />
            {allowExport && <ExportTooltip onClick={onExportClick} />}
            {onBulkAddClick && <BulkAddTooltip onClick={onBulkAddClick} />}
            {onBulkUpdateClick && <BulkUpdateTooltip onClick={onBulkUpdateClick} />}
            {onBulkDeleteClick && <BulkDeleteTooltip onClick={onBulkDeleteClick} />}
            {additionalActions.map((a, i) => (
                <Button startIcon={<AppIcon name={a.icon} />} key={i} color="primary" variant="text" onClick={a.onClick}>
                    {a.label}
                </Button>
            ))}
        </Toolbar>
    );
}
function BulkAddTooltip({ onClick }: { onClick: MouseEventHandler<HTMLDivElement> }): JSX.Element {
    return (
        <Tooltip className="mx-1" onClick={onClick} title="Ajout groupé">
            <ToolbarButton size="small">
                <AppIcon name="Update" />
            </ToolbarButton>
        </Tooltip>
    );
}
function BulkUpdateTooltip({ onClick }: { onClick: MouseEventHandler<HTMLDivElement> }): JSX.Element {
    return (
        <Tooltip className="mx-1" onClick={onClick} title="Modification groupée">
            <ToolbarButton size="small" render={<IconButton outline="true" />}>
                <AppIcon name="Update" />
            </ToolbarButton>
        </Tooltip>
    );
}
function BulkDeleteTooltip({ onClick }: { onClick: MouseEventHandler<HTMLDivElement> }): JSX.Element {
    return (
        <Tooltip className="mx-1" onClick={onClick} title="Suppression groupée">
            <ToolbarButton size="small" render={<IconButton outline="true" />}>
                <AppIcon name="Update" />
            </ToolbarButton>
        </Tooltip>
    );
}
function PanelTooltip(): JSX.Element {
    return (
        <Tooltip className="mx-1" title="Colonnes" aria-label="Colonnes">
            <ColumnsPanelTrigger size="small" render={<IconButton outline="true" />}>
                <AppIcon name="ViewColumn" />
            </ColumnsPanelTrigger>
        </Tooltip>
    );
}
function DensityTooltip(): JSX.Element {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const apiRef = useGridApiContext();
    const density = useGridSelector(apiRef, gridDensitySelector);

    const densityOptions: { label: string; icon: IconNameType; value: GridDensity }[] = [
        { label: 'Compacte', icon: 'ViewHeadline', value: 'compact' },
        { label: 'Normal', icon: 'TableRows', value: 'standard' },
        { label: 'Dense', icon: 'ViewStream', value: 'comfortable' },
    ];

    return (
        <>
            <Tooltip
                enterDelay={1000}
                className="mx-1"
                onClick={() => setIsMenuOpen(true)}
                ref={triggerRef}
                aria-haspopup="true"
                aria-controls="density-menu"
                id="density-menu-trigger"
                aria-expanded={isMenuOpen ? 'true' : undefined}
                title="Densité"
            >
                <ToolbarButton size="small" render={<IconButton outline="true" />}>
                    <AppIcon name="TableRows" />
                </ToolbarButton>
            </Tooltip>
            <Menu
                id="density-menu"
                anchorEl={triggerRef.current}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                slotProps={{
                    list: {
                        'aria-labelledby': 'density-menu-trigger',
                    },
                }}
            >
                {densityOptions.map((o, i) => (
                    <MenuItem
                        selected={o.value === density}
                        key={i}
                        onClick={() => {
                            apiRef.current.setDensity(o.value);
                            setIsMenuOpen(false);
                        }}
                    >
                        <ListItemIcon>
                            <AppIcon name={o.icon} />
                        </ListItemIcon>
                        <ListItemText>{o.label}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

function ExportTooltip({ onClick }: { onClick: (e: 'csv' | 'xlsx') => void }): JSX.Element {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const { translate } = useResources();

    return (
        <>
            <Tooltip
                className="mx-1"
                onClick={() => setIsMenuOpen(true)}
                ref={triggerRef}
                aria-haspopup="true"
                aria-controls="export-menu"
                id="export-menu-trigger"
                aria-expanded={isMenuOpen ? 'true' : undefined}
                title="Densité"
            >
                <ToolbarButton size="small" render={<IconButton outline="true" />}>
                    <AppIcon name="Download" />
                </ToolbarButton>
            </Tooltip>
            <Menu
                id="export-menu"
                anchorEl={triggerRef.current}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                slotProps={{
                    list: {
                        'aria-labelledby': 'export-menu-trigger',
                    },
                }}
            >
                <MenuItem onClick={() => onClick('xlsx')}>
                    <ListItemIcon>
                        <AppIcon name={'FileExcel'} />
                    </ListItemIcon>
                    <ListItemText>{translate('center.bulk.exportCSV')}</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => onClick('csv')}>
                    <ListItemIcon>
                        <AppIcon name={'FileCsv'} />
                    </ListItemIcon>
                    <ListItemText>{translate('center.bulk.exportXlsx')}</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}
interface ICustomToolBar {
    onExportClick: (e: 'csv' | 'xlsx') => void;
    allowExport?: boolean;
    onBulkAddClick: () => void;
    onBulkUpdateClick: () => void;
    onBulkDeleteClick: () => void;
    additionalActions?: CustomTableAction[];
}
//#region Pagination
function Pagination({ page, onPageChange, className }: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>): JSX.Element {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    return (
        <MuiPagination
            color="primary"
            className={className}
            count={pageCount}
            page={page + 1}
            boundaryCount={3}
            onChange={(e, newPage) => {
                onPageChange(e as MouseEvent<HTMLButtonElement>, newPage - 1);
            }}
        />
    );
}
//#endregion
