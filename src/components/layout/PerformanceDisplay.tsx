import { PerformanceType } from '~/models/Performance';
import { Bold, Regular } from '../common/Text';
import { JSX } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function PerformanceDisplay({ perf }: IPerformanceDisplay): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Execution</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {perf.data.details.map((p, i) => {
                        return (
                            <TableRow key={i}>
                                <TableCell>{p.category}</TableCell>
                                <TableCell>{Math.round(p.duration).toLocaleString()} ms</TableCell>
                                <TableCell>{Math.round(p.durationFromStart).toLocaleString()} ms</TableCell>
                                <TableCell>{p.description}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Box paddingLeft={2} paddingBlock={2} display={'flex'}>
                <Bold marginRight={1}>Total Execution</Bold>
                <Regular>{Math.round(perf.data.total).toLocaleString()} ms</Regular>
            </Box>
            <Divider />
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IPerformanceDisplay {
    perf: PerformanceType;
}
// #enderegion IPROPS --> //////////////////////////////////
