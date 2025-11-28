 
import React, { useEffect } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AddItemForm } from '../../components/AddItemForm';
import { ShoppingItem } from '../../components/ShoppingItem';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import type { AppDispatch, RootState } from '../../store';
import { addItem, deleteItem, editItem, loadShoppingList, setItems, togglePurchased } from '../../store/slices/shoppingSlice';

export default function ShoppingListScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.shopping.items);

  useEffect(() => {
    const initializeData = async () => {
      const savedItems = await loadShoppingList();
      dispatch(setItems(savedItems));
    };
    initializeData();
  }, [dispatch]);

  const handleAddItem = (name: string, quantity: string) => {
    dispatch(addItem({ name, quantity }));
  };

  const handleEditItem = (id: string, name: string, quantity: string) => {
    dispatch(editItem({ id, name, quantity }));
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteItem(id)) },
      ]
    );
  };

  const handleTogglePurchased = (id: string) => {
    dispatch(togglePurchased(id));
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Shopping List</ThemedText>
      
      <AddItemForm onAddItem={handleAddItem} />
      
      {items.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>Your shopping list is empty</ThemedText>
          <ThemedText style={styles.emptySubtext}>Add some items to get started!</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ShoppingItem
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onToggle={handleTogglePurchased}
            />
          )}
          style={styles.list}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});
