import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Actions
import {
    deleteProductCategory,
    fetchProductCategories,
    saveProductCategory
} from 'store/product/actions';

// Selectors
import {
    selectProductCategories,
    selectProductCategoriesCount,
    selectIsLoadingCategories
} from 'store/product/selector';

// Components
import CategoriesSection from 'sections/categories/categories';

// Types, Constants, Misc
import { IAutocompleteItem } from 'components/autocomplete/types';
import { TSortingState } from 'components/generic_table/types';
import { TCategory } from 'constants/objectInterfaces';
import { invertSort } from 'utils/utils';

const defaultSortState = {
    orderBy: 'description',
    sort: 'ASC'
};

const ProductsCategories = () => {
    const [currentSortState, setCurrentSortState] = useState<TSortingState>(defaultSortState);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchField, setSearchField] = useState<string>('');

    const categories: TCategory[] = useSelector(selectProductCategories);
    const isCategoriesLoading: boolean = useSelector(selectIsLoadingCategories);
    const totalCount: number = useSelector(selectProductCategoriesCount);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProductCategories(currentPage - 1));
    }, []);

    const onDeleteCategory = (category: TCategory) => {
        dispatch(deleteProductCategory(
            category,
            currentPage - 1,
            currentSortState,
            searchField
        ));
    }

    const onAddNewCategory = (categoryName: string) => {
        const newCategory: TCategory = {
            id: null,
            description: categoryName
        }

        dispatch(saveProductCategory(
            newCategory,
            currentPage - 1,
            currentSortState,
            searchField
        ));
    };

    const onSortChange = (page: number, orderBy: string, sort: string) => {
        const newSort: string = orderBy === currentSortState.orderBy ? invertSort(currentSortState.sort) : sort;

        setCurrentSortState({ orderBy, sort: newSort });
        dispatch(fetchProductCategories(page - 1, { orderBy, sort: newSort }, searchField));
    };

    const onSearch = (item: IAutocompleteItem | string | null) => {
        let newSearchInput = '';
        if (item !== null) {
            newSearchInput = typeof (item) === 'string' ? item : item.description;
        }

        setSearchField(newSearchInput);
        if (newSearchInput.length >= 2 || newSearchInput.length === 0) {
            dispatch(fetchProductCategories(0, currentSortState, newSearchInput));
        }
    };

    const onPageChange = (newPage: number) => {
        setCurrentPage(newPage);
        dispatch(fetchProductCategories(newPage - 1, currentSortState, searchField));
    };

    return (
        <CategoriesSection
            color={'green'}
            data={categories}
            isLoading={isCategoriesLoading}
            searchOptions={categories}
            searchValue={searchField}
            sortState={currentSortState}
            totalCount={totalCount}

            onAddNewCategory={onAddNewCategory}
            onDeleteCategory={onDeleteCategory}
            onPageChange={onPageChange}
            onSearch={onSearch}
            onSortChange={onSortChange}
        />
    );
};

export default ProductsCategories;
