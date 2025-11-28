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

// Load state from AsyncStorage
export const loadShoppingList = async (): Promise<ShoppingItem[]> => {
  try {
    const saved = await AsyncStorage.getItem('shoppingList');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading shopping list:', error);
    return [];
  }
};

// Save state to AsyncStorage
export const saveShoppingList = async (items: ShoppingItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem('shoppingList', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving shopping list:', error);
  }
};

const shoppingSlice = createSlice({
  name: 'shopping',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<ShoppingItem[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<Omit<ShoppingItem, 'id' | 'purchased'>>) => {
      const newItem: ShoppingItem = {
        id: Date.now().toString(),
        name: action.payload.name,
        quantity: action.payload.quantity,
        purchased: false,
      };
      state.items.push(newItem);
      saveShoppingList(state.items);
    },
    editItem: (state, action: PayloadAction<{ id: string; name: string; quantity: string }>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
        saveShoppingList(state.items);
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveShoppingList(state.items);
    },
    togglePurchased: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.purchased = !item.purchased;
        saveShoppingList(state.items);
      }
    },
  },
});

export const { setItems, addItem, editItem, deleteItem, togglePurchased } = shoppingSlice.actions;
export default shoppingSlice.reducer;
