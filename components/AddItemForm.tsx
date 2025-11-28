import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemedView } from './themed-view';

interface Props {
  onAddItem: (name: string, quantity: string) => void;
}

export const AddItemForm: React.FC<Props> = ({ onAddItem }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      onAddItem(name.trim(), quantity.trim());
      setName('');
      setQuantity('');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter item name"
        value={name}
        onChangeText={setName}
        onSubmitEditing={handleAdd}
      />
      <TextInput
        style={[styles.input, styles.quantityInput]}
        placeholder="Qty"
        value={quantity}
        onChangeText={setQuantity}
        onSubmitEditing={handleAdd}
      />
      <TouchableOpacity 
        style={[styles.addButton, !name.trim() && styles.disabled]} 
        onPress={handleAdd}
        disabled={!name.trim()}
      >
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  quantityInput: {
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
});
