import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { ShoppingItem as ShoppingItemType } from '../store/slices/shoppingSlice';

interface Props {
  item: ShoppingItemType;
  onEdit: (id: string, name: string, quantity: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export const ShoppingItem: React.FC<Props> = ({ item, onEdit, onDelete, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQuantity, setEditQuantity] = useState(item.quantity);

  const handleSave = () => {
    if (editName.trim()) {
      onEdit(item.id, editName.trim(), editQuantity.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setIsEditing(false);
  };

  return (
    <ThemedView style={[styles.item, item.purchased && styles.purchased]}>
      <TouchableOpacity onPress={() => onToggle(item.id)} style={styles.checkbox}>
        <View style={[styles.checkboxInner, item.purchased && styles.checked]} />
      </TouchableOpacity>

      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={editName}
            onChangeText={setEditName}
            placeholder="Item name"
          />
          <TextInput
            style={[styles.input, styles.quantityInput]}
            value={editQuantity}
            onChangeText={setEditQuantity}
            placeholder="Qty"
          />
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.buttonText}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.buttonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.itemContent}>
          <ThemedText style={[styles.itemName, item.purchased && styles.purchasedText]}>
            {item.name}
          </ThemedText>
          {item.quantity && (
            <ThemedText style={[styles.quantity, item.purchased && styles.purchasedText]}>
              ({item.quantity})
            </ThemedText>
          )}
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  purchased: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  checked: {
    backgroundColor: '#007AFF',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
  },
  purchasedText: {
    textDecorationLine: 'line-through',
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    backgroundColor: 'white',
  },
  quantityInput: {
    flex: 0.5,
  },
  editButton: {
    backgroundColor: '#FFA000',
    padding: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 6,
    borderRadius: 4,
    marginLeft: 4,
  },
  cancelButton: {
    backgroundColor: '#757575',
    padding: 6,
    borderRadius: 4,
    marginLeft: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
