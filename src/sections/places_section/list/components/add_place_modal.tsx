import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Actions
import { fetchPlaceCategories } from 'store/place/actions';

// Selectors
import { getPlaceCategories } from 'store/place/selector';

import { TextField } from '@material-ui/core';
import { FormDialog, Autocomplete } from 'components/index';

import {
    IPlace,
    ICategory
} from 'constants/objectInterfaces';
import {
    place as placeModel
} from 'constants/objectModels';

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (object: IPlace) => void;
}

const AddPlaceModal = ({
    isOpen,
    onClose,
    onConfirm
}: IProps) => {
    const [selectedItem, setSelectedItem] = useState<IPlace>(placeModel);
    const categories: ICategory[] = useSelector(getPlaceCategories);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPlaceCategories());
    }, []);

    const onDescriptionChange = (event: any) => {
        const value = event.target.value;

        if (value) {
            setSelectedItem({
                ...selectedItem,
                created: selectedItem?.created || '',
                category_id: selectedItem?.category_id,
                category_description: selectedItem?.category_description || '',
                description: value,
                id: selectedItem?.id
            });
        }
    };

    const onCategoryChange = (
        description: any = null
    ) => {
        let category_id = null;
        let category_description = '';

        if (description) {
            const categoryObject = categories.find((category) => category.description === description);

            if (categoryObject !== undefined && categoryObject.id) {
                category_id = categoryObject.id;
                category_description = categoryObject.description;
            }
        }

        setSelectedItem({
            ...selectedItem,
            category_id,
            category_description
        });
    };

    const renderAddDialogForm = () => (
        <>
            <TextField
                autoFocus
                fullWidth
                id="description"
                label="Nome"
                type="text"
                onChange={onDescriptionChange}
            />
            <div className="min-padding">
                <Autocomplete
                    options={categories}
                    title="Categoria"
                    onChange={onCategoryChange}
                />
            </div>
        </>
    );

    return (
        <FormDialog
            isEnable={selectedItem.description !== '' && selectedItem.category_id !== null}
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={() => selectedItem ? onConfirm(selectedItem) : null}
            title='Adicionar Novo Lugar'
        >
            {renderAddDialogForm()}
        </FormDialog>
    );
};

export default AddPlaceModal;
