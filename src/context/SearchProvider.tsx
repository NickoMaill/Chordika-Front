// #region IMPORTS -> /////////////////////////////////////
import { ReactNode, useState } from 'react';
import { SearchField, SortField, SearchContext } from './searchContext';
import useStorage from '~/hooks/useStorage';
import { FormMakerType, FormMakerPartEnum } from '~/types/FormMakerCoreTypes';
import appTool from '~/helpers/appTool';
import { AppTableStructure } from '~/components/common/AppTable';
import NavigationResource from '~/resources/navigationResources';
import { JSX } from 'react';
import useAppContext from './appContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function SearchProvider({ children }: ISearchProvider): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [filters, setFilters] = useState<SearchField[]>([]);
    const [sortedBy, setSortedBy] = useState<SortField>(null);
    const [maxRows, setMaxRows] = useState<number>(50);
    const [page, setPage] = useState<number>(0);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { isItemExist, getParsedItem } = useStorage();
    const { perfMode } = useAppContext();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const clear = (): void => {
        setFilters([]);
        setSortedBy(null);
        setMaxRows(isItemExist('maxRows') ? getParsedItem<number>('maxRows') : 50);
        setPage(0);
    };

    const buildSorter = (): string => {
        if (sortedBy) {
            return encodeURIComponent(`${sortedBy.sortField} ${sortedBy.order}`);
        } else {
            return '';
        }
    };

    const buildSearchURL = (): string => {
        const query = new URLSearchParams();
        if (filters?.length > 0) {
            filters.forEach((f) => {
                query.append(f.field, f.values);
            });
        }
        if (sortedBy) {
            query.append('sort', buildSorter());
        }
        if (maxRows && maxRows !== 50) {
            query.append('maxRows', maxRows.toString());
        }
        if (page) {
            query.append('page', (page + 1).toString());
        }
        if (perfMode) {
            query.append('perf', '1');
        }
        return query.toString();
    };

    const parseSearchURL = <T,>(tableStructure: AppTableStructure<T>, formTemplate: FormMakerType<FormMakerPartEnum>): void => {
        clear();
        const searchContent = appTool.ParseSearchUrl(formTemplate);
        const urlSearch = new URLSearchParams(window.location.search);
        if (searchContent.length > 0) {
            setFilters(searchContent);
        }

        if (urlSearch.has('maxRows') && !isNaN(Number(urlSearch.get('maxRows')))) {
            const r = parseInt(urlSearch.get('maxRows'));
            setMaxRows(r);
        } else {
            setMaxRows(50);
        }

        if (urlSearch.has('page') && !isNaN(Number(urlSearch.get('page')))) {
            const r = parseInt(urlSearch.get('page'));
            setPage(r > 0 ? r - 1 : 0);
        } else {
            setPage(0);
        }

        if (urlSearch.has('sort')) {
            setSort(decodeURIComponent(urlSearch.get('sort')), tableStructure);
        } else {
            if (tableStructure.defaultSort) {
                setSortedBy({
                    sortField: tableStructure.defaultSort.field.toString(),
                    sortLabel: tableStructure.colStruct.find((c) => c.headerField === tableStructure.defaultSort.field).headerLabel,
                    order: tableStructure.defaultSort.sort,
                });
            }
        }
    };
    const setSort = <T,>(s: string, tableStructure: AppTableStructure<T>): void => {
        const sort = s.split(' ');
        const index = tableStructure.colStruct.findIndex((c) => c.headerField === sort[0]);
        if (index > -1) {
            setSortedBy({
                sortField: sort[0],
                sortLabel: tableStructure.colStruct[index].headerLabel,
                order: sort[1].toLowerCase() === 'desc' ? 'desc' : 'asc',
            });
        }
    };
    const buildBackURL = (entity: string, basePath?: string): string => {
        const query = new URLSearchParams();
        if (filters?.length > 0) {
            filters.forEach((f) => {
                query.append(f.field, f.values);
            });
        }
        const sortedBy = buildSorter();
        if (sortedBy) {
            query.append('sort', sortedBy);
            //url += `&sort=${Ctx.state.sort}`;
        }
        if (maxRows !== 50) {
            query.append('maxRows', maxRows.toString());
        }
        if (page) {
            query.append('page', (page + 1).toString());
        }
        return `${basePath ?? `${NavigationResource.routesPath.center}/${entity}`}` + (query.toString() ? `?${query.toString()}` : '');
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    const searchValue = { filters, setFilters, sortedBy, setSortedBy, maxRows, setMaxRows, page, setPage, clear, buildSorter, buildSearchURL, parseSearchURL, setSort, buildBackURL };
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return <SearchContext.Provider value={searchValue}>{children}</SearchContext.Provider>;
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface ISearchProvider {
    children: ReactNode;
}
// #enderegion IPROPS --> //////////////////////////////////
