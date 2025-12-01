import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, clearAllItems, deleteItem, editItem, loadShoppingListFromStorage, setItems, togglePurchased } from '../../store/slices/myShoppingSlice';

const colors = {
  background: '#F8FFF8',
  card: 'white',
  primary: '#4CAF50',
  text: '#2E7D32',
  lightText: '#666666'
};

const groceryItems = [
  { name: 'Peaches', image: require('../../assets/images/fruits/peaches.jpg'), category: 'fruits', price: 'R50', unit: 'each' },
  { name: 'Oranges', image: require('../../assets/images/fruits/oranges.jpg'), category: 'fruits', price: 'R30', unit: 'each' },
  { name: 'Blueberry', image: require('../../assets/images/fruits/blueberry.jpg'), category: 'fruits', price: 'R200', unit: 'pack' },
  { name: 'Bell Peppers', image: require('../../assets/images/vegetables/bell peppers.jpg'), category: 'vegetables', price: 'R80', unit: 'each' },
  { name: 'Onions', image: require('../../assets/images/vegetables/onions.jpg'), category: 'vegetables', price: 'R40', unit: 'each' },
  { name: 'Eggs', image: require('../../assets/images/dairy/Egg.jpg'), category: 'dairy', price: 'R350', unit: 'dozen' },
  { name: 'Yogurt', image: require('../../assets/images/dairy/yogurt.jpg'), category: 'dairy', price: 'R120', unit: 'cup' },
  { name: 'Tomato Sauce', image: require('../../assets/images/other/Tomato sauce.jpg'), category: 'other', price: 'R180', unit: 'jar' },
  { name: 'Bread', image: require('../../assets/images/other/bread.jpg'), category: 'other', price: 'R25', unit: 'loaf' },
];

export default function SimpleShoppingList() {
  const dispatch = useDispatch();
  const items = useSelector((state: any) => state.shopping.items);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('item');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editUnit, setEditUnit] = useState('item');

  useEffect(() => {
    const loadSavedItems = async () => {
      const savedItems = await loadShoppingListFromStorage();
      dispatch(setItems(savedItems));
    };
    loadSavedItems();
  }, [dispatch]);

  const purchasedItems = items.filter((item: any) => item.purchased).length;

  const addNewItem = () => {
    if (itemName.trim() !== '') {
      dispatch(addItem({ name: itemName, quantity: quantity, unit: unit }));
      setItemName('');
      setQuantity('1');
      setUnit('item');
    }
  };

  const addCommonItem = (item: any) => {
    dispatch(addItem({ name: item.name, quantity: '1', unit: item.unit }));
  };

  const deleteItemFromList = (id: string) => {
    dispatch(deleteItem(id));
  };

  const startEditing = (item: any) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditQuantity(item.quantity || '1');
    setEditUnit(item.unit || 'item');
  };

  const saveEdit = () => {
    if (editName.trim() !== '' && editingId) {
      dispatch(editItem({ id: editingId, name: editName, quantity: editQuantity, unit: editUnit }));
      cancelEdit();
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditQuantity('');
    setEditUnit('item');
  };

  const handleClearAll = () => {
    if (items.length > 0) {
      Alert.alert('Clear All Items', 'Remove all items from your list?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => {
          dispatch(clearAllItems());
        }},
      ]);
    }
  };

  const handleClearPurchased = () => {
    const purchased = items.filter((item: any) => item.purchased);
    if (purchased.length > 0) {
      Alert.alert('Clear Purchased', `Remove ${purchased.length} purchased items?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          purchased.forEach((item: any) => {
            dispatch(deleteItem(item.id));
          });
        }},
      ]);
    } else {
      Alert.alert('No Purchased Items', 'You have no purchased items to clear.');
    }
  };

  const findItemImage = (itemName: string) => {
    const foundItem = groceryItems.find(item => item.name.toLowerCase() === itemName.toLowerCase());
    return foundItem ? foundItem.image : require('../../assets/images/other/bread.jpg');
  };

  const CategorySection = ({ title, category }: { title: string; category: string }) => (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          {groceryItems.filter(item => item.category === category).map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={{ backgroundColor: colors.card, padding: 10, borderRadius: 10, alignItems: 'center', marginRight: 10, width: 80 }}
              onPress={() => addCommonItem(item)}
            >
              <Image source={item.image} style={{ width: 50, height: 50, borderRadius: 8 }} />
              <Text style={{ fontSize: 12, marginTop: 5, textAlign: 'center' }}>{item.name}</Text>
              <Text style={{ fontSize: 10, color: colors.primary, marginTop: 2 }}>{item.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ backgroundColor: colors.primary, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>My Shopping List</Text>
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 5 }}>
          {items.length} item{items.length !== 1 ? 's' : ''} on list • {purchasedItems} purchased
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 15 }}>
        <CategorySection title="Fruits" category="fruits" />
        <CategorySection title="Vegetables" category="vegetables" />
        <CategorySection title="Dairy" category="dairy" />
        <CategorySection title="Other" category="other" />

        <View style={{ backgroundColor: colors.card, padding: 15, borderRadius: 10, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Add Custom Item:</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#DDD', padding: 12, marginBottom: 10, borderRadius: 8, backgroundColor: '#F9F9F9' }}
            placeholder="Item name"
            value={itemName}
            onChangeText={setItemName}
          />
          <View style={{ flexDirection: 'row', marginBottom: 15, gap: 10 }}>
            <TextInput
              style={{ flex: 1, borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 8, backgroundColor: '#F9F9F9' }}
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
            />
            <TextInput
              style={{ width: 100, borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 8, backgroundColor: '#F9F9F9' }}
              placeholder="Unit"
              value={unit}
              onChangeText={setUnit}
            />
          </View>
          <TouchableOpacity 
            style={{ backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center' }}
            onPress={addNewItem}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Add to List</Text>
          </TouchableOpacity>
        </View>

        {items.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: colors.text }}>Manage List:</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity 
                style={{ 
                  flex: 1,
                  backgroundColor: '#FF9800', 
                  padding: 15, 
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 60
                }}
                onPress={handleClearPurchased}
                activeOpacity={0.7}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Clear Purchased</Text>
                <Text style={{ color: 'white', fontSize: 12, marginTop: 2 }}>{purchasedItems} items</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{ 
                  flex: 1,
                  backgroundColor: '#F44336', 
                  padding: 15, 
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 60
                }}
                onPress={handleClearAll}
                activeOpacity={0.7}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Clear All</Text>
                <Text style={{ color: 'white', fontSize: 12, marginTop: 2 }}>{items.length} items</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {items.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Text style={{ fontSize: 18, color: colors.lightText, textAlign: 'center' }}>Your list is empty</Text>
            <Text style={{ fontSize: 14, color: colors.lightText, textAlign: 'center', marginTop: 5 }}>Add some items above!</Text>
          </View>
        ) : (
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Your Shopping List:</Text>
            {items.map((item: any) => (
              <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: 12, marginBottom: 8, borderRadius: 8 }}>
                <Image source={findItemImage(item.name)} style={{ width: 45, height: 45, borderRadius: 6, marginRight: 12 }} />
                
                {editingId === item.id ? (
                  <View style={{ flex: 1 }}>
                    <TextInput style={{ borderWidth: 1, borderColor: colors.primary, padding: 8, borderRadius: 6, marginBottom: 5, backgroundColor: 'white' }} value={editName} onChangeText={setEditName} />
                    <View style={{ flexDirection: 'row' }}>
                      <TextInput style={{ flex: 1, borderWidth: 1, borderColor: colors.primary, padding: 8, borderRadius: 6, marginRight: 8, backgroundColor: 'white' }} value={editQuantity} onChangeText={setEditQuantity} placeholder="Qty" />
                      <TextInput style={{ width: 80, borderWidth: 1, borderColor: colors.primary, padding: 8, borderRadius: 6, backgroundColor: 'white' }} value={editUnit} onChangeText={setEditUnit} placeholder="Unit" />
                    </View>
                  </View>
                ) : (
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', textDecorationLine: item.purchased ? 'line-through' : 'none' }}>{item.name}</Text>
                    <Text style={{ fontSize: 14, color: colors.lightText }}>{item.quantity} {item.unit}</Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row' }}>
                  {editingId === item.id ? (
                    <>
                      <TouchableOpacity onPress={saveEdit} style={{ padding: 8, marginRight: 8, backgroundColor: colors.primary, borderRadius: 6 }}><Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>Save</Text></TouchableOpacity>
                      <TouchableOpacity onPress={cancelEdit} style={{ padding: 8, backgroundColor: '#FFEBEE', borderRadius: 6 }}><Text style={{ color: '#F44336', fontWeight: 'bold', fontSize: 12 }}>Cancel</Text></TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity onPress={() => dispatch(togglePurchased(item.id))} style={{ padding: 8, marginRight: 8, backgroundColor: item.purchased ? colors.primary : '#F0F0F0', borderRadius: 6 }}>
                        <Text style={{ color: item.purchased ? 'white' : colors.text, fontWeight: 'bold', fontSize: 12 }}>{item.purchased ? 'Done' : 'Mark'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => startEditing(item)} style={{ padding: 8, marginRight: 8, backgroundColor: '#E3F2FD', borderRadius: 6 }}><Text style={{ color: '#2196F3', fontWeight: 'bold', fontSize: 12 }}>Edit</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteItemFromList(item.id)} style={{ padding: 8, backgroundColor: '#FFEBEE', borderRadius: 6 }}><Text style={{ color: '#F44336', fontWeight: 'bold', fontSize: 12 }}>Delete</Text></TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
