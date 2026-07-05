import { paperClasses } from '@mui/material/Paper';
import { alpha, Theme } from '@mui/material/styles';
import type { DataGridComponents } from '@mui/x-data-grid/themeAugmentation';
import { menuItemClasses } from '@mui/material/MenuItem';
import { listItemIconClasses } from '@mui/material/ListItemIcon';
import { iconButtonClasses } from '@mui/material/IconButton';
import { inputBaseClasses } from '@mui/material/InputBase';
import { checkboxClasses } from '@mui/material/Checkbox';
import { listClasses } from '@mui/material/List';
import { gridClasses } from '@mui/x-data-grid';
import { tablePaginationClasses } from '@mui/material/TablePagination';
import { gray } from '../themePrimitives';

export const dataGridCustomizations: DataGridComponents<Theme> & DataGridComponents<Theme> = {
    MuiDataGrid: {
        styleOverrides: {
            root: ({ theme }) => ({
                '--DataGrid-overlayHeight': '300px',
                // overflow: 'clip',
                borderColor: (theme.vars || theme).palette.divider,
                backgroundColor: (theme.vars || theme).palette.background.default,
                [`& .${gridClasses.columnHeader}`]: {
                    backgroundColor: (theme.vars || theme).palette.background.paper,
                },
                [`& .${gridClasses.footerContainer}`]: {
                    backgroundColor: (theme.vars || theme).palette.background.paper,
                },
                [`& .${checkboxClasses.root}`]: {
                    padding: theme.spacing(0.5),
                    '& > svg': {
                        fontSize: '1rem',
                    },
                },
                [`& .${tablePaginationClasses.root}`]: {
                    borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
                },
                [`& .${gridClasses.columnHeader}:last-of-type .${gridClasses.columnSeparator}`]: {
                    display: 'none!important',
                },
            }),
            cell: ({ theme }) => ({ borderTopColor: (theme.vars || theme).palette.divider }),
            menu: ({ theme }) => ({
                borderRadius: theme.shape.borderRadius,
                backgroundImage: 'none',
                [`& .${paperClasses.root}`]: {
                    border: `1px solid ${(theme.vars || theme).palette.grey[500]}`,
                },

                [`& .${menuItemClasses.root}`]: {
                    margin: '0 4px',
                },
                [`& .${listItemIconClasses.root}`]: {
                    marginRight: 0,
                },
                [`& .${listClasses.root}`]: {
                    paddingLeft: 0,
                    paddingRight: 0,
                },
            }),

            row: ({ theme }) => ({
                '&:last-of-type': { borderBottom: `0px solid ${(theme.vars || theme).palette.grey[100]}` },
                '&:hover': {
                    backgroundColor: (theme.vars || theme).palette.action.hover,
                },
                '&:nth-of-type(even)': {
                    backgroundColor: (theme.vars || theme).palette.grey[30],
                },
                ...theme.applyStyles('dark', {
                    '&:nth-of-type(even)': {
                        backgroundColor: (theme.vars || theme).palette.grey[800],
                    },
                }),
                '&.Mui-selected': {
                    background: (theme.vars || theme).palette.action.selected,
                    '&:hover': {
                        backgroundColor: (theme.vars || theme).palette.action.hover,
                    },
                },
            }),
            iconButtonContainer: ({ theme }) => ({
                [`& .${iconButtonClasses.root}`]: {
                    border: 'none',
                    backgroundColor: 'transparent',
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.action.selected, 0.3),
                    },
                    '&:active': {
                        backgroundColor: gray[200],
                    },
                    ...theme.applyStyles('dark', {
                        color: gray[50],
                        '&:hover': {
                            backgroundColor: gray[800],
                        },
                        '&:active': {
                            backgroundColor: gray[900],
                        },
                    }),
                },
            }),
            menuIconButton: ({ theme }) => ({
                border: 'none',
                backgroundColor: 'transparent',
                '&:hover': {
                    backgroundColor: gray[100],
                },
                '&:active': {
                    backgroundColor: gray[200],
                },
                ...theme.applyStyles('dark', {
                    color: gray[50],
                    '&:hover': {
                        backgroundColor: gray[800],
                    },
                    '&:active': {
                        backgroundColor: gray[900],
                    },
                }),
            }),
            filterForm: ({ theme }) => ({
                gap: theme.spacing(1),
                alignItems: 'flex-end',
            }),
            columnsManagementHeader: ({ theme }) => ({
                paddingRight: theme.spacing(3),
                paddingLeft: theme.spacing(3),
            }),
            columnHeaderTitleContainer: {
                flexGrow: 1,
                justifyContent: 'space-between',
            },
            columnHeaderDraggableContainer: { paddingRight: 2 },
            toolbar: ({ theme }) => ({
                backgroundColor: (theme.vars || theme).palette.background.paper,
                borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
                padding: 0,
                minHeight: '47px',
            }),
            columnSeparator: ({ theme }) => ({
                color: (theme.vars || theme).palette.grey[400],
            }),
            toolbarQuickFilter: {
                [`& .${inputBaseClasses.root}`]: {
                    marginLeft: 6,
                    marginRight: 6,
                },
                [`& .${iconButtonClasses.root}`]: {
                    height: '36px',
                    width: '36px',
                },
                [`& .${iconButtonClasses.edgeEnd}`]: {
                    border: 'none',
                    height: '28px',
                    width: '28px',
                },
            },
        },
    },
};
