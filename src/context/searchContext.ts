import { Dispatch, SetStateAction, createContext } from 'react';
import { AppTableStructure } from '~/components/common/AppTable';
import { FormMakerContentType, FormMakerPartEnum } from '~/types/FormMakerCoreTypes';

export interface ISearchContext {
    filters: SearchField[];
    setFilters?: Dispatch<SetStateAction<SearchField[]>>;
    sortedBy: SortField;
    setSortedBy?: Dispatch<SetStateAction<SortField>>;
    maxRows: number;
    setMaxRows?: Dispatch<SetStateAction<number>>;
    page: number;
    setPage?: Dispatch<SetStateAction<number>>;
    clear?: () => void;
    buildSorter: () => string;
    buildSearchURL: (entity: string) => string;
    /* eslint-disable @typescript-eslint/no-explicit-any*/
    parseSearchURL?: (tableStructure: AppTableStructure<any>, formTemplate: FormMakerContentType<FormMakerPartEnum>[]) => void;
    setSort?: <T>(s: string, tableStructure: AppTableStructure<T>) => void;
    buildBackURL?: (entity: string) => string;
}

const initialContext: ISearchContext = {
    filters: null,
    sortedBy: null,
    maxRows: 50,
    page: 1,
    buildSorter: () => '',
    buildSearchURL: () => '',
};

export type SearchField = {
    field: string;
    fieldName: string;
    values: string;
    formattedValue?: string;
};

export type SortField = {
    sortField: string;
    sortLabel: string;
    order: 'asc' | 'desc';
};

const SearchContext = createContext<ISearchContext>(initialContext);

export default SearchContext;
