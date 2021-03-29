import * as ACTIONTYPES from '../actionTypes';
import { IPurchaseItem, IShoppingListItem } from '../../constants/objectInterfaces';
import { dynamicSort } from '../../utils/utils'

interface IAction {
    type: string,
    purchaseList: IPurchaseItem[],
    itemId: number,
    response: IShoppingListItem,
    errorMessage: string
}

const initialState = {
    error: false,
    errorMessage: '',
    loading: false,
    purchaseList: []
};

export default function purchaseReducer(
    state = initialState,
    action: IAction
) {
    switch (action.type) {
        case ACTIONTYPES.CONVERT_TO_PURCHASE:
            return {
                ...state,
                purchaseList: [
                    ...state.purchaseList,
                    ...action.purchaseList
                ].sort(dynamicSort('description'))
            };
        case ACTIONTYPES.REMOVE_ITEM_FROM_PURCHASE:
            return {
                ...state,
                purchaseList: state.purchaseList.filter((item: IPurchaseItem) => item.id !== action.itemId)
            };
        case ACTIONTYPES.UPDATE_PURCHASE_ITEM:
            return {
                ...state,
                purchaseList: action.purchaseList.sort(dynamicSort('description'))
            };
        case ACTIONTYPES.CLEAR_PURCHASE:
            return {
                ...initialState
            }
        case ACTIONTYPES.SAVING_PURCHASE_LIST:
            return {
                ...state,
                loading: true
            }
        case ACTIONTYPES.SAVING_PURCHASE_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                error: false,
                purchaseList: []
            }
        case ACTIONTYPES.SAVING_PURCHASE_LIST_ERROR:
            return {
                ...state,
                loading: false,
                error: true,
                errorMessage: action.errorMessage,
            }

        default:
            return state;
    }
}
