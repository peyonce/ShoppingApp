import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  purchased: boolean;
}

interface ShoppingState {
  items: ShoppingItem[];
}

const initialState: ShoppingState = {
  items: [],
};

// Save shopping list to AsyncStorage
const saveShoppingListToStorage = async (items: ShoppingItem[]) => {
  try {
    await AsyncStorage.setItem('myShoppingList', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving shopping list:', error);
  }
};

// Load shopping list from AsyncStorage - MAKE SURE THIS IS EXPORTED
export const loadShoppingListFromStorage = async (): Promise<ShoppingItem[]> => {
  try {
    const savedData = await AsyncStorage.getItem('myShoppingList');
    return savedData ? JSON.parse(savedData) : [];
  } catch (error) {
    console.error('Error loading shopping list:', error);
    return [];
  }
};

const myShoppingSlice = createSlice({
  name: 'shopping',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<ShoppingItem[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<{ name: string; quantity: string }>) => {
      const newItem: ShoppingItem = {
        id: Date.now().toString(),
        name: action.payload.name,
        quantity: action.payload.quantity,
        purchased: false,
      };
      state.items.push(newItem);
      saveShoppingListToStorage(state.items);
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveShoppingListToStorage(state.items);
    },
    togglePurchased: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.purchased = !item.purchased;
        saveShoppingListToStorage(state.items);
      }
    },
    editItem: (state, action: PayloadAction<{ id: string; name: string; quantity: string }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.name = action.payload.name;
        item.quantity = action.payload.quantity;
        saveShoppingListToStorage(state.items);
      }
    },
  },
});

export const { setItems, addItem, deleteItem, togglePurchased, editItem } = myShoppingSlice.actions;
export default myShoppingSlice.reducer;
