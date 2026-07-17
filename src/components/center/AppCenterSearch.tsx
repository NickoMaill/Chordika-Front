// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import { Bold, Bolder } from '../common/Text';
import { lazy, useState } from 'react';
import { SearchField } from '~/context/searchContext';
import { FormMakerPartEnum, FormMakerType } from '~/types/FormMakerCoreTypes';
import FormMaker from '../formMaker/FormMaker';
import useResources from '~/hooks/useResources';
import { CenterGrammarType, GenericActionEnum } from '~/types/centerType';
import appTool from '~/helpers/appTool';
import { JSX } from 'react';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { Button, Chip, Grid, Paper } from '@mui/material';
import useSearchContext from '~/context/searchContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function AppCenterSearch<T>({ searchFormStruct, onSubmitSearchForm, grammar }: IAppCenterSearch): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isSearchFormVisible, setIsSearchFormVisible] = useState<boolean>(false);
    const [isNew, setIsNew] = useState<boolean>(true);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { filters, sortedBy, setFilters, setPage } = useSearchContext();
    const { translate } = useResources();
    const { palette } = useTheme();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const openCloseModal = (isNew?: boolean): void => {
        setIsNew(isNew);
        setIsSearchFormVisible(!isSearchFormVisible);
    };

    const mapSearchFieldToObject = (): T | null => {
        if (filters) {
            const obj = new Object();
            filters.forEach((f) => {
                Object.defineProperty(obj, f.field, { value: f.values, writable: true });
            });
            return obj as T;
        } else {
            return null;
        }
    };

    const onSubmit = (f: T): void => {
        const searchField: SearchField[] = appTool.ParseSearchUrl(searchFormStruct, f as Record<string, string>);
        setFilters(searchField);
        setPage(0);
        onSubmitSearchForm();
        setIsSearchFormVisible(false);
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <Grid container component={Paper} variant="outlined" className="mb-3 rounded-3 p-3 d-flex align-items-center w-100" sx={{ gap: '1rem' }}>
                <Grid component={Paper} variant="outlined" className="rounded p-1 d-flex align-items-center">
                    <AppIcon name="TuneRounded" color="primary" />
                </Grid>
                <Grid sx={{ flexGrow: 1 }}>
                    <Bolder className="mb-1" color="paper">
                        {translate('common.filters').toString().toUpperCase()}
                    </Bolder>
                    <Box className="d-flex align-items-center flex-wrap" sx={{ gap: '0.5rem' }}>
                        {filters.length > 0 ? (
                            filters.map((filter, i) => {
                                return <Chip key={i} label={`${filter.fieldName} : ${filter.formattedValue}`} />;
                            })
                        ) : (
                            <Chip label={translate('center.search.nothing')} />
                        )}
                        {sortedBy && (
                            <Chip label={`${translate('center.search.orderBy')} ${sortedBy.sortLabel}`} icon={<AppIcon name={sortedBy.order === 'asc' ? 'ArrowUpward' : 'ArrowDownward'} />} />
                        )}
                    </Box>
                </Grid>
                <Grid display="flex">
                    {filters && filters.length > 0 && (
                        <Button variant="outlined" sx={{ bgcolor: 'background.default' }} className="me-2" startIcon={<AppIcon name="TuneRounded" />} onClick={() => openCloseModal(false)}>
                            <Bold className="cursor-pointer">{translate('center.search.updateSearch')}</Bold>
                        </Button>
                    )}
                    {searchFormStruct && searchFormStruct.length > 0 && (
                        <Button variant="outlined" sx={{ bgcolor: 'background.default' }} startIcon={<AppIcon name="SearchRounded" />} onClick={() => openCloseModal(true)}>
                            <Bold className="cursor-pointer">{translate('center.search.newSearch')}</Bold>
                        </Button>
                    )}
                </Grid>
            </Grid>
            {searchFormStruct && searchFormStruct.length > 0 && (
                <>
                    <Drawer
                        slotProps={{ root: { sx: { zIndex: 1202 } }, paper: { className: 'rounded-start', sx: { position: { xs: 'unset', sm: 'fixed' } } } }}
                        open={isSearchFormVisible}
                        anchor="right"
                        onClose={() => openCloseModal(true)}
                    >
                        <Box width={{ sm: '650px' }} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} className="px-5 position-relative">
                            <IconButton aria-label="close" onClick={() => openCloseModal(false)} className="position-absolute top-0 start-0 m-1">
                                <AppIcon name="Close" />
                            </IconButton>
                            <Box className="m-4 mt-5 w-100 d-flex align-items-center">
                                <Bold component={'h5'} className="pe-2" variant="h5">{`${translate('common.search')} ${grammar.plural}`}</Bold>
                                <AppIcon name="Search" sx={{ color: palette.grey[500] }} />
                            </Box>
                            <FormMaker<T>
                                isSearchForm
                                grammar={grammar.plural}
                                action={GenericActionEnum.TABLE}
                                outputType="JSON"
                                data={filters && !isNew ? mapSearchFieldToObject() : null}
                                structure={searchFormStruct}
                                onBackPress={() => openCloseModal(true)}
                                onSubmit={onSubmit}
                            />
                        </Box>
                    </Drawer>
                </>
            )}
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppCenterSearch {
    searchFormStruct?: FormMakerType<FormMakerPartEnum.SEARCH>;
    onSubmitSearchForm?: () => void;
    searchData?: SearchField[];
    grammar: CenterGrammarType;
}
// #endregion IPROPS --> //////////////////////////////////
