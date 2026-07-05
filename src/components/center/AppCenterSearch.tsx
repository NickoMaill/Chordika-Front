// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import { Bold, Regular } from '../common/Text';
import { lazy, useContext, useState } from 'react';
import SearchContext, { SearchField } from '~/context/searchContext';
import { FormMakerContentType, FormMakerPartEnum } from '~/types/FormMakerCoreTypes';
import FormMaker from '../formMaker/FormMaker';
import useResources from '~/hooks/useResources';
import { CenterGrammarType, GenericActionEnum } from '~/types/centerType';
import appTool from '~/helpers/appTool';
import { JSX } from 'react';
import Link from '@mui/material/Link';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
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
    const Search = useContext(SearchContext);
    const Resources = useResources();
    const theme = useTheme();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const openCloseModal = (isNew?: boolean): void => {
        setIsNew(isNew);
        setIsSearchFormVisible(!isSearchFormVisible);
    };

    const mapSearchFieldToObject = (): T | null => {
        if (Search.filters) {
            const obj = new Object();
            Search.filters.forEach((f) => {
                Object.defineProperty(obj, f.field, { value: f.values, writable: true });
            });
            return obj as T;
        } else {
            return null;
        }
    };

    const onSubmit = (f: T): void => {
        const searchField: SearchField[] = appTool.ParseSearchUrl(searchFormStruct, f as Record<string, string>);
        Search.setFilters(searchField);
        Search.setPage(0);
        onSubmitSearchForm();
        setIsSearchFormVisible(false);
    };

    const formatFiltersView = (): string => {
        if (Search.filters) {
            const searchString = Search.filters.map((filter) => {
                return `${filter.fieldName} : ${filter.formattedValue}`;
            });
            return searchString.join(', ');
        } else {
            return '';
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <Box display="flex" flexWrap={'wrap'} alignItems={'center'} marginBottom={1}>
                <Box display={'flex'}>
                    <Regular className="me-1">
                        <b>{Resources.translate('common.filters')}</b> : {!Search.filters || Search.filters.length < 1 ? Resources.translate('center.search.nothing') : formatFiltersView() + ', '} {Search.sortedBy ? Resources.translate('center.search.orderBy') : null}{' '}
                    </Regular>
                    {Search.sortedBy && (
                        <Bold display="flex" alignItems="center" marginRight={2}>
                            {Search.sortedBy.sortLabel}
                            <AppIcon name={Search.sortedBy.order === 'asc' ? 'ArrowUpward' : 'ArrowDownward'} />
                        </Bold>
                    )}
                </Box>
                <Box display="flex">
                    {Search.filters && Search.filters.length > 0 && (
                        <Link marginRight={3} component={'a'} onClick={() => openCloseModal(false)}>
                            <Bold className="cursor-pointer">{Resources.translate('center.search.updateSearch')}</Bold>
                        </Link>
                    )}
                    {searchFormStruct && searchFormStruct.length > 0 && (
                        <Link component={'a'} onClick={() => openCloseModal(true)}>
                            <Bold className="cursor-pointer">{Resources.translate('center.search.newSearch')}</Bold>
                        </Link>
                    )}
                </Box>
            </Box>
            {searchFormStruct && searchFormStruct.length > 0 && (
                <>
                    <Drawer slotProps={{ root: { sx: { zIndex: 1202 } }, paper: { className: 'rounded-start', sx: { position: { xs: 'unset', sm: 'fixed' } } } }} open={isSearchFormVisible} anchor="right" onClose={() => openCloseModal(true)}>
                        <Box width={{ sm: '650px' }} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} className="px-5 position-relative">
                            <IconButton aria-label="close" onClick={() => openCloseModal(false)} className="position-absolute top-0 start-0 m-1">
                                <AppIcon name="Close" />
                            </IconButton>
                            <Box className="m-4 mt-5 w-100 d-flex align-items-center">
                                <Bold component={'h5'} className="pe-2" variant="h5">{`${Resources.translate('common.search')} ${grammar.plural}`}</Bold>
                                <AppIcon name="Search" sx={{ color: theme.palette.grey[500] }} />
                            </Box>
                            <FormMaker<T> isSearchForm grammar={grammar.plural} action={GenericActionEnum.TABLE} outputType="JSON" data={Search.filters && !isNew ? mapSearchFieldToObject() : null} structure={searchFormStruct} onBackPress={() => openCloseModal(true)} onSubmit={onSubmit} />
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
    searchFormStruct?: FormMakerContentType<FormMakerPartEnum.SEARCH>[];
    onSubmitSearchForm?: () => void;
    searchData?: SearchField[];
    grammar: CenterGrammarType;
}
// #endregion IPROPS --> //////////////////////////////////
