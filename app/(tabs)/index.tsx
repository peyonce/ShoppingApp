import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, deleteItem, togglePurchased, editItem, setItems } from '../../store/slices/myShoppingSlice';
import { loadShoppingListFromStorage } from '../../store/slices/myShoppingSlice';

// Your unique color scheme
const colors = {
  primary: '#FF6B35',    // Orange
  secondary: '#4ECDC4',  // Teal
  background: '#FFF9F7', // Light orange background
  text: '#292F36',       // Dark gray text
  success: '#45B7D1',    // Blue
  warning: '#FFA000',    // Amber
  error: '#F44336'       // Red
};

export default function MyShoppingList() {
  const dispatch = useDispatch();
  const shoppingItems = useSelector((state: any) => state.shopping.items);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [currentlyEditingId, setCurrentlyEditingId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemQuantity, setEditItemQuantity] = useState('');

  // Load saved items when component mounts
  useEffect(() => {
    const initializeShoppingData = async () => {
      const savedShoppingItems = await loadShoppingListFromStorage();
      dispatch(setItems(savedShoppingItems));
    };
    initializeShoppingData();
  }, [dispatch]);

  // Function to add a new shopping item
  const handleAddNewItem = () => {
    if (newItemName.trim()) {
      dispatch(addItem({ name: newItemName, quantity: newItemQuantity }));
      setNewItemName('');
      setNewItemQuantity('');
    }
  };

  // Function to remove an item with confirmation
  const handleRemoveItem = (itemId: string, itemName: string) => {
    Alert.alert(
      'Remove Item',
      `Remove "${itemName}" from your list?`,
      [
        { text: 'Keep Item', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive', 
          onPress: () => dispatch(deleteItem(itemId))
        },
      ]
    );
  };

  // Start editing an item
  const beginEditing = (item: any) => {
    setCurrentlyEditingId(item.id);
    setEditItemName(item.name);
    setEditItemQuantity(item.quantity);
  };

  // Save edited item
  const saveItemEdit = () => {
    if (currentlyEditingId && editItemName.trim()) {
      dispatch(editItem({ 
        id: currentlyEditingId, 
        name: editItemName, 
        quantity: editItemQuantity 
      }));
      setCurrentlyEditingId(null);
      setEditItemName('');
      setEditItemQuantity('');
    }
  };

  // Cancel editing
  const cancelItemEdit = () => {
    setCurrentlyEditingId(null);
    setEditItemName('');
    setEditItemQuantity('');
  };

  // Clear all items
  const clearAllItems = () => {
    if (shoppingItems.length === 0) return;
    
    Alert.alert(
      'Clear All Items',
      'Remove all items from your shopping list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive', 
          onPress: () => {
            shoppingItems.forEach((item: any) => {
              dispatch(deleteItem(item.id));
            });
          }
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>
      <Text style={{ 
        fontSize: 28, 
        fontWeight: 'bold', 
        marginBottom: 25, 
        textAlign: 'center', 
        color: colors.text,
        textTransform: 'uppercase',
        letterSpacing: 1
      }}>
        My Shopping List
      </Text>
      
      {/* Clear All Button - New Feature */}
      {shoppingItems.length > 0 && (
        <TouchableOpacity 
          style={{ 
            backgroundColor: colors.error, 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 15,
            alignItems: 'center'
          }}
          onPress={clearAllItems}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            Clear All Items ({shoppingItems.length})
          </Text>
        </TouchableOpacity>
      )}
      
      {/* Add New Item Section */}
      <View style={{ marginBottom: 20 }}>
        <TextInput
          style={{ 
            borderWidth: 2, 
            borderColor: colors.primary,
            padding: 14, 
            marginBottom: 12, 
            backgroundColor: 'white',
            borderRadius: 10,
            fontSize: 16
          }}
          placeholder="What do you need to buy?"
          value={newItemName}
          onChangeText={setNewItemName}
        />
        <TextInput
          style={{ 
            borderWidth: 2, 
            borderColor: colors.secondary,
            padding: 14, 
            marginBottom: 16, 
            backgroundColor: 'white',
            borderRadius: 10,
            fontSize: 16
          }}
          placeholder="How many?"
          value={newItemQuantity}
          onChangeText={setNewItemQuantity}
        />
        <Button 
          title="➕ Add to List" 
          onPress={handleAddNewItem} 
          color={colors.primary} 
        />
      </View>
      
      {/* Shopping Items List */}
      {shoppingItems.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Text style={{ 
            textAlign: 'center', 
            fontSize: 18, 
            color: colors.text,
            marginBottom: 10
          }}>
            Your shopping list is empty
          </Text>
          <Text style={{ 
            textAlign: 'center', 
            fontSize: 14, 
            color: '#666',
            fontStyle: 'italic'
          }}>
            Add some items above to get started!
          </Text>
        </View>
      ) : (
        <FlatList
          data={shoppingItems}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 10 }}
          renderItem={({ item }) => (
            <View style={{ 
              padding: 15, 
              marginVertical: 6,
              backgroundColor: 'white',
              borderRadius: 12,
              borderWidth: 2,
              borderColor: item.purchased ? colors.success : colors.primary,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}>
              {/* Item Header with Checkbox and Name */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <TouchableOpacity 
                  style={{
                    width: 28,
                    height: 28,
                    borderWidth: 2,
                    borderColor: item.purchased ? colors.success : colors.primary,
                    borderRadius: 14,
                    marginRight: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: item.purchased ? colors.success : 'transparent'
                  }}
                  onPress={() => dispatch(togglePurchased(item.id))}
                >
                  {item.purchased && (
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>✓</Text>
                  )}
                </TouchableOpacity>
                
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: 'bold',
                  textDecorationLine: item.purchased ? 'line-through' : 'none',
                  color: item.purchased ? '#888' : colors.text,
                  flex: 1
                }}>
                  {item.name}
                </Text>
              </View>

              {/* Item Details and Actions */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {currentlyEditingId === item.id ? (
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={{ 
                        flex: 1, 
                        borderWidth: 1, 
                        borderColor: colors.primary,
                        padding: 8,
                        marginRight: 8,
                        backgroundColor: 'white',
                        borderRadius: 6
                      }}
                      value={editItemName}
                      onChangeText={setEditItemName}
                      placeholder="Item name"
                    />
                    <TextInput
                      style={{ 
                        width: 70, 
                        borderWidth: 1, 
                        borderColor: colors.secondary,
                        padding: 8,
                        marginRight: 8,
                        backgroundColor: 'white',
                        borderRadius: 6
                      }}
                      value={editItemQuantity}
                      onChangeText={setEditItemQuantity}
                      placeholder="Qty"
                    />
                    <TouchableOpacity 
                      style={{ backgroundColor: colors.success, padding: 8, borderRadius: 6, marginRight: 8 }}
                      onPress={saveItemEdit}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={{ backgroundColor: '#666', padding: 8, borderRadius: 6 }}
                      onPress={cancelItemEdit}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <Text style={{ 
                      fontSize: 14, 
                      color: colors.secondary,
                      fontWeight: '600'
                    }}>
                      {item.quantity ? `Quantity: ${item.quantity}` : 'No quantity set'}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity 
                        style={{ backgroundColor: colors.warning, padding: 8, borderRadius: 6, marginRight: 8 }}
                        onPress={() => beginEditing(item)}
                      >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={{ backgroundColor: colors.error, padding: 8, borderRadius: 6 }}
                        onPress={() => handleRemoveItem(item.id, item.name)}
                      >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
