import { JSX } from 'react';
import Box from '@mui/material/Box';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function CircularProgressWithLabel(props: CircularProgressProps & { value: number; labelColor?: string; labelSize?: string }): JSX.Element {
    const { labelColor = 'white', labelSize = '0.65rem' } = props;
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" sx={{ color: labelColor, fontSize: labelSize }}>{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}
