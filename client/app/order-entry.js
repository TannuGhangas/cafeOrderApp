// app/order-entry.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { X, Plus, Minus, CupSoda, Coffee, Droplet, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';

const DRINK_DETAILS = {
  tea: {
    name: 'Tea',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
    options: { type: ['Black Tea', 'Milk Tea'], temp: ['Hot', 'Cold'], milk: ['Dairy', 'Oat', 'None'] },
    icon: CupSoda
  },
  coffee: {
    name: 'Coffee',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    options: { type: ['Black Coffee', 'Milk Coffee'], temp: ['Hot', 'Iced'], milk: ['Dairy', 'Almond', 'Coconut'] },
    icon: Coffee
  },
  'green-tea': {
    name: 'Green Tea',
    image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400',
    options: { type: ['Mint Green Tea', 'Lemon Green Tea', 'Plain'], temp: ['Hot', 'Iced'], milk: ['None'] },
    icon: CupSoda
  },
  milk: {
    name: 'Milk',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST7XnmdF3Jvuk98wc9gJALC0lZeWk5OBt9AQ&s',
    options: { type: ['Dairy', 'Oat', 'Almond'], temp: ['Hot', 'Cold'], milk: ['None'] },
    icon: Droplet
  },
  water: {
    name: 'Water',
    image: 'https://images.stockcake.com/public/b/a/4/ba483125-a815-4a61-bba9-381bb61784b0_large/glass-of-water-stockcake.jpg',
    options: { type: ['Still'], temp: ['Hot', 'Cold', 'Room Temp'], milk: ['None'] },
    icon: Droplet
  }
};

export default function OrderEntry() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { drinkId, timeOfDay } = params;
  const { addToCart } = useCart();

  const drink = DRINK_DETAILS[drinkId] || DRINK_DETAILS['coffee'];

  const [selectedType, setSelectedType] = useState(drink.options.type[0]);
  const [selectedTemp, setSelectedTemp] = useState(drink.options.temp[0]);
  const [selectedMilk, setSelectedMilk] = useState(drink.options.milk[0]);
  const [sugarLevel, setSugarLevel] = useState('1');
  const [customSugar, setCustomSugar] = useState('');
  const [quantity, setQuantity] = useState(1);

  const SUGAR_OPTIONS = ['0', '1', '2', '3', 'Custom'];

  const handleAdd = () => {
    const finalSugar = sugarLevel === 'Custom' ? customSugar : sugarLevel;

    if (quantity <= 0) {
      Alert.alert('Error', 'Quantity must be greater than 0');
      return;
    }

    addToCart({
      id: Date.now().toString(),
      drinkId,
      name: drink.name,
      type: selectedType,
      temp: selectedTemp,
      milk: selectedMilk,
      sugarLevel: drinkId === 'water' ? 'N/A' : finalSugar,
      quantity,
      timeOfDay,
      image: drink.image
    });

    router.back();
  };

  return (
    <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          title: `Customize ${drink.name}`,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          )
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: drink.image }} style={styles.image} />
          <View style={styles.iconBadge}>
            <drink.icon size={30} color="#FFF" />
          </View>
        </View>

        {/* Drink Type Options */}
        {drink.options.type.length > 1 && (
          <Option label={`${drink.name} Type`} selected={selectedType} setSelected={setSelectedType} options={drink.options.type} />
        )}

        {/* Temperature */}
        {drink.options.temp.length > 1 && (
          <Option label="Temperature" selected={selectedTemp} setSelected={setSelectedTemp} options={drink.options.temp} />
        )}

        {/* Milk Type */}
        {drink.options.milk.length > 1 && (
          <Option label="Milk Type" selected={selectedMilk} setSelected={setSelectedMilk} options={drink.options.milk} />
        )}

        {/* Sugar */}
        {drinkId !== 'water' && (
          <>
            <Text style={styles.label}>Sugar Level</Text>

            <View style={styles.sugarRow}>
              {SUGAR_OPTIONS.map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  style={[styles.sugarButton, sugarLevel === lvl && styles.sugarButtonActive]}
                  onPress={() => {
                    setSugarLevel(lvl);
                    if (lvl !== 'Custom') setCustomSugar('');
                  }}
                >
                  <Text style={[styles.sugarText, sugarLevel === lvl && styles.sugarTextActive]}>{lvl}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {sugarLevel === 'Custom' && (
              <TextInput
                style={styles.customInput}
                placeholder="Enter sugar level"
                value={customSugar}
                onChangeText={setCustomSugar}
              />
            )}
          </>
        )}

        {/* Quantity */}
        <Text style={styles.label}>Quantity</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
            <Minus size={20} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
            <Plus size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 15 }]}>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addText}>Add {quantity} to Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Option({ label, options, selected, setSelected }) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
        {options.map((op) => (
          <TouchableOpacity
            key={op}
            style={[styles.optionButton, selected === op && styles.optionButtonActive]}
            onPress={() => setSelected(op)}
          >
            <Text style={[styles.optionText, selected === op && styles.optionTextActive]}>{op}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 15 },
  imageContainer: { height: 200, borderRadius: 15, overflow: 'hidden', marginBottom: 20 },
  image: { width: '100%', height: '100%' },
  iconBadge: { position: 'absolute', bottom: 10, left: 10, backgroundColor: '#A0522D', padding: 10, borderRadius: 50 },

  label: { fontSize: 16, fontWeight: '700', marginVertical: 10, color: '#4A2C2A' },

  optionButton: { padding: 10, marginRight: 8, borderRadius: 20, backgroundColor: '#F3F3F5' },
  optionButtonActive: { backgroundColor: '#A0522D' },
  optionText: { color: '#555' },
  optionTextActive: { color: '#FFF', fontWeight: 'bold' },

  sugarRow: { flexDirection: 'row', gap: 10 },
  sugarButton: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#F3F3F5', alignItems: 'center' },
  sugarButtonActive: { backgroundColor: '#FF8C42' },
  sugarText: { color: '#555' },
  sugarTextActive: { color: '#FFF', fontWeight: '700' },

  customInput: { borderWidth: 1, borderColor: '#FF8C42', padding: 10, borderRadius: 10 },

  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150,
    backgroundColor: '#A0522D',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center'
  },
  quantityText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },

  bottomBar: { paddingHorizontal: 15, paddingTop: 10 },
  addButton: {
    height: 55,
    backgroundColor: '#FF8C42',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
