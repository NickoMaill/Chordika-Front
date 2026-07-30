// #region IMPORTS -> /////////////////////////////////////
import { Box, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import { ChangeEvent, JSX, useMemo, useState } from 'react';
import AppIcon from '~/components/common/AppIcon';
import ContentLayout from '~/components/layout/ContentLayout';
import MusicSymbolCard from '~/components/symbols/MusicSymbolCard';
import { MusicSymbol, MusicSymbolItem, MusicSymbolList, MusicSymbolName } from '~/types/musicSymbol';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function Symbols(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////

    const categories = useMemo(() => {
        return [...new Set(MusicSymbolList.map((symbol) => symbol.category))].sort();
    }, []);

    const filteredSymbols = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return MusicSymbolList.filter((symbol) => {
            const matchesSearch = !normalizedSearch || symbol.name.toLowerCase().includes(normalizedSearch) || symbol.codePoint.toLowerCase().includes(normalizedSearch);

            const matchesCategory = category === 'all' || symbol.category === category;

            return matchesSearch && matchesCategory;
        });
    }, [search, category]);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setSearch(event.target.value);
    };

    const handleSymbolClick = async (symbol: MusicSymbolItem): Promise<void> => {
        await navigator.clipboard.writeText(symbol.name);
    };
    const getSymbolsKeys = (): MusicSymbolName[] => {
        const keys = Object.keys(MusicSymbol);
        return [...keys] as MusicSymbolName[];
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <ContentLayout title="Dictionnaire des symboles">
            <Box
                sx={{
                    mb: 3,
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                }}
            >
                <TextField
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Rechercher un symbole..."
                    sx={{ flex: 1, minWidth: 250 }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AppIcon name="Search" />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Select value={category} onChange={(event) => setCategory(event.target.value)} sx={{ minWidth: 200 }}>
                    <MenuItem value="all">Toutes les catégories</MenuItem>

                    {categories.map((item) => (
                        <MenuItem key={item} value={item}>
                            {item}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
                {filteredSymbols.length} symbole{filteredSymbols.length > 1 ? 's' : ''}
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: 2,
                }}
            >
                {filteredSymbols.map((symbol) => (
                    <MusicSymbolCard key={symbol.name} symbol={symbol} onClick={handleSymbolClick} />
                ))}
            </Box>
        </ContentLayout>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface ISymbols {}
// #enderegion IPROPS --> //////////////////////////////////
