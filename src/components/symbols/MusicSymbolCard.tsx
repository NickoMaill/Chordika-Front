// #region IMPORTS -> /////////////////////////////////////
import { Box, Card, CardActionArea, Typography } from '@mui/material';
import { JSX } from 'react';
import { MusicSymbolItem } from '~/types/musicSymbol';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function MusicSymbolCard({ symbol, onClick }: IMusicSymbolCard): JSX.Element {
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
        <Card variant="outlined">
            <CardActionArea
                onClick={() => onClick?.(symbol)}
                sx={{
                    height: '100%',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        minHeight: 70,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Bravura',
                        fontSize: '3rem',
                    }}
                >
                    {symbol.value}
                </Box>

                <Typography
                    variant="caption"
                    textAlign="center"
                    sx={{
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                    title={symbol.name}
                >
                    {symbol.name}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                    {symbol.codePoint}
                </Typography>
            </CardActionArea>
        </Card>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IMusicSymbolCard {
    symbol: MusicSymbolItem;
    onClick?: (symbol: MusicSymbolItem) => void;
}
// #enderegion IPROPS --> //////////////////////////////////
