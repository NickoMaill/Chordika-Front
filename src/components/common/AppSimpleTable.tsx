import React, { lazy, ReactNode, useEffect } from 'react';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import { RecursiveKeyOf } from '~/types/custom';
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
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const navSize = '1.8rem';
// #endregion SINGLETON --> /////////////////////////////////

export default function AppSimpleTable<T extends object>({ columns, rows = [], isLoading = true, sm = false, totalPages, currentPage, onPageChange, noContentMessage, id }: IAppSimpleTable<T>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const check = (): void => {
        const iAction = columns.findIndex((h) => h.field === 'action');

        if (iAction > -1 && !columns[iAction].valueFormatter) {
            throw new AppError(ErrorTypeEnum.Functional, 'action need a value formatter col', 'need_formatter');
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        check();
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box className="w-100">
            <Table id={id} size={sm ? 'small' : 'medium'}>
                <TableHead>
                    <TableRow>
                        {columns.map((h, i) => (
                            <TableCell variant="head" align={h.align ?? 'left'} key={i}>
                                {h.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isLoading ? (
                        (rows && rows.length > 5 ? rows.map((_r, i) => i) : [0, 1, 2, 3, 4, 5]).map((_, i) => (
                            <TableRow key={i}>
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
                            <TableRow key={i}>
                                {columns.map((h, i2) => (
                                    <TableCell align={h.align ?? 'left'} key={i2}>
                                        {(h.valueFormatter ? h.valueFormatter(l) : h.field.split('.').reduce((acc, key) => acc?.[key], l)) as ReactNode}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
                {totalPages && totalPages > 0 ? (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={columns.length}>
                                <IconButton outline="true" sx={{ width: navSize, height: navSize }} disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} className="p-0" size="small">
                                    <AppIcon name="ChevronLeftRounded" />
                                </IconButton>
                                <IconButton outline="true" sx={{ width: navSize, height: navSize }} disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} size="small" className="mx-2">
                                    <AppIcon name="ChevronRightRounded" />
                                </IconButton>
                                {currentPage} sur {totalPages} pages
                            </TableCell>
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
}

export type AppSimpleTableColStructType<T extends object> = { field: RecursiveKeyOf<T> | 'action'; label: string; align?: 'left' | 'right'; valueFormatter?: (v: T) => unknown };
// #enderegion IPROPS --> //////////////////////////////////
