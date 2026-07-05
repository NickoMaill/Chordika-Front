import React, { lazy, ReactNode, useEffect, useRef, useState } from 'react';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import { JSX } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Checkbox, MenuItem, Select } from '@mui/material';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const navSize = '1.8rem';
// #endregion SINGLETON --> /////////////////////////////////

export default function AppSimpleTable<T extends object>({
    columns,
    rows = [],
    isLoading = true,
    sm = false,
    totalPages,
    currentPage,
    onPageChange,
    noContentMessage,
    id,
    footerActions,
    colspanFooterActions,
    footerActionsAlign = 'right',
    checkable = false,
    onSelectionChange,
    rowsPerPage,
    rowsPerPageOptions = [],
    onRowsPerPageChange,
}: IAppSimpleTable<T>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isTableLoading, setIsTableLoading] = useState<boolean>(true);
    const [selected, setSelected] = useState<Set<number>>(new Set([]));
    // eslint-disable-next-line no-undef
    const timeoutref = useRef<NodeJS.Timeout | null>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const manageLoading = (): void => {
        if (isLoading) {
            if (timeoutref.current) clearTimeout(timeoutref.current);

            timeoutref.current = setTimeout(() => setIsTableLoading(true), 1_000);
        } else {
            if (timeoutref.current) clearTimeout(timeoutref.current);
            setIsTableLoading(false);
        }
    };
    const check = (): void => {
        const iAction = columns.findIndex((h) => h.field === 'action');

        if (iAction > -1 && !columns[iAction].valueFormatter) {
            throw new AppError(ErrorTypeEnum.Functional, 'action need a value formatter col', 'need_formatter', 'Actions column, on table component, need a value formater to be displayed correctly');
        }
    };

    const onSelectAll = (checked: boolean): void => {
        if (!checked) {
            rows.forEach((_, i) =>
                setSelected((prevState) => {
                    prevState.add(i);
                    return new Set(prevState);
                })
            );
        } else {
            setSelected(new Set());
        }
    };

    const handleCheckChange = (value: number, checked: boolean): void => {
        if (checked) {
            setSelected((prevState) => {
                prevState.add(value);
                return new Set(prevState);
            });
        } else {
            setSelected((prevState) => {
                prevState.delete(value);
                return new Set(prevState);
            });
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        check();
    }, []);
    useEffect(() => {
        manageLoading();
    }, [isLoading]);
    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange([...selected]);
        }
    }, [selected]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box className="w-100">
            <Table id={id} size={sm ? 'small' : 'medium'}>
                <TableHead>
                    <TableRow>
                        {checkable && (
                            <TableCell padding="checkbox" component={"th"} variant="head" align={'center'}>
                                <Checkbox onChange={(e) => onSelectAll(e.target.checked)} defaultChecked />{' '}
                            </TableCell>
                        )}
                        {columns.map((h, i) => (
                            <TableCell variant="head" component={"th"} sx={{ fontWeight: 'bold' }} align={h.align ?? 'left'} key={i}>
                                {h.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isTableLoading ? (
                        (rows && rows.length > 5 ? rows.map((_r, i) => i) : [0, 1, 2, 3, 4, 5]).map((_, i) => (
                            <TableRow key={i}>
                                {checkable && (
                                    <TableCell variant="head" align={'center'} padding="checkbox">
                                        <Checkbox checked={selected.has(i)} onChange={(e) => handleCheckChange(i, e.target.checked)} />
                                    </TableCell>
                                )}
                                {columns.map((c, i1) => (
                                    <TableCell align={c.align ?? 'left'} key={i1}>
                                        <Skeleton variant="text" animation="wave" width="100%" height={20} />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : rows.length === 0 ? (
                        <TableRow>
                            <TableCell className="text-center p-5 fw-bold" colSpan={columns.length}>
                                {noContentMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((l, i) => (
                            <TableRow hover key={i}>
                                {checkable && (
                                    <TableCell variant="head" align={'center'} padding="checkbox">
                                        <Checkbox checked={selected.has(i)} onChange={(e) => handleCheckChange(i, e.target.checked)} />
                                    </TableCell>
                                )}
                                {columns.map((h, i2) => (
                                    <TableCell align={h.align ?? 'left'} key={i2}>
                                        {(h.valueFormatter ? h.valueFormatter(l) : (h.field as string).split('.').reduce((acc, key) => acc?.[key], l)) as ReactNode}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
                {(totalPages && totalPages > 0) || footerActions ? (
                    <TableFooter>
                        <TableRow>
                            {totalPages && totalPages > 0 && (
                                <TableCell colSpan={footerActions ? columns.length - colspanFooterActions : columns.length + (checkable ? 1 : 0)}>
                                    <IconButton
                                        outline="true"
                                        sx={{ width: navSize, height: navSize }}
                                        disabled={currentPage <= 1}
                                        onClick={() => onPageChange(currentPage - 1)}
                                        className="p-0"
                                        size="small"
                                    >
                                        <AppIcon name="ChevronLeftRounded" />
                                    </IconButton>
                                    <IconButton
                                        outline="true"
                                        sx={{ width: navSize, height: navSize }}
                                        disabled={currentPage === totalPages}
                                        onClick={() => onPageChange(currentPage + 1)}
                                        size="small"
                                        className="mx-2"
                                    >
                                        <AppIcon name="ChevronRightRounded" />
                                    </IconButton>
                                    {currentPage} sur {totalPages} page{totalPages > 1 && 's'}
                                    {rowsPerPageOptions.length > 0 && (
                                        <>
                                            {' | '}résultats par pages
                                            <Select value={rowsPerPage} size="small" onChange={(e) => onRowsPerPageChange(e.target.value)} className="ms-2">
                                                {rowsPerPageOptions.map((r, i) => (
                                                    <MenuItem value={r} key={i} selected={r === rowsPerPage}>
                                                        {r}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </>
                                    )}
                                </TableCell>
                            )}
                            {footerActions && (
                                <TableCell align={footerActionsAlign} colSpan={colspanFooterActions}>
                                    {footerActions}
                                </TableCell>
                            )}
                        </TableRow>
                    </TableFooter>
                ) : null}
            </Table>
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppSimpleTable<T extends object> {
    columns: AppSimpleTableColStructType<T>[];
    sm?: boolean;
    rows?: T[];
    totalPages?: number;
    currentPage?: number;
    onPageChange?: (newPage: number) => void;
    isLoading?: boolean;
    noContentMessage?: string;
    loadingMessage?: string;
    id?: string;
    footerActions?: ReactNode;
    colspanFooterActions?: number;
    footerActionsAlign?: 'left' | 'right';
    checkable?: boolean;
    onSelectionChange?: (selected: number[]) => void;
    rowsPerPageOptions?: number[];
    rowsPerPage?: number;
    onRowsPerPageChange?: (x: number) => void;
}

export type AppSimpleTableColStructType<T extends object> = {
    field: keyof T | 'action';
    label: string;
    subLabel?: string;
    align?: 'left' | 'right';
    valueFormatter?: (v: T) => unknown;
};
// #enderegion IPROPS --> //////////////////////////////////
