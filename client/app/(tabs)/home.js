// app/(drawer)/index.js
import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, SafeAreaView, Dimensions, StatusBar
} from 'react-native';

import { useRouter, useNavigation, Stack } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Menu, Coffee, Utensils, Clock, ShoppingCart } from 'lucide-react-native';

import { useCart } from '../../context/CartContext'; // ✅ Use Cart Context
import { BASE_API_URL } from '../../constants/api';


const { width } = Dimensions.get('window');
const SPACING = 20;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - (SPACING * (NUM_COLUMNS + 1))) / NUM_COLUMNS;

const DRINKS = [
  { name: 'Espresso', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', id: 'coffee', color: '#4A2C2A' },
  { name: 'Herbal Tea', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400', id: 'tea', color: '#B3674E' },
  { name: 'Matcha', image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400', id: 'green-tea', color: '#5C8E64' },
  { name: 'Fresh Milk', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST7XnmdF3Jvuk98wc9gJALC0lZeWk5OBt9AQ&s', id: 'milk', color: '#A9A9A9' }, 
  { name: 'Mineral Water', image: 'https://images.stockcake.com/public/b/a/4/ba483125-a815-4a61-bba9-381bb61784b0_large/glass-of-water-stockcake.jpg', id: 'water', color: '#4682B4' }, 
];

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation();

  // ✅ Cart Context — replaces your old state
  const { items: currentOrders, clear, addItem } = useCart();

  const [timeOfDay, setTimeOfDay] = useState('morning');

  const handleMenuOpen = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  // ✅ FIXED — No local state, use Context
  const handlePlaceOrder = async () => {
    if (currentOrders.length === 0) return;

    try {
      const payload = {
        name: "Tannu",
        timeSlot: timeOfDay,
        items: currentOrders.map(i => ({
          name: i.name,
          type: i.type,
          temp: i.temp,
          milk: i.milk,
          sugar: i.sugarLevel,
          quantity: i.quantity
        }))
        
      };

      const response = await fetch(`${BASE_API_URL}/api/orders/client/tannu-client-id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Order failed");

      clear(); // empty cart
      router.push({
        pathname: "/order-placed",
        params: { totalItems: payload.items.length }
      });

    } catch (err) {
      console.log("❌ Order failed", err);
      alert("Failed to place order.");
    }
  };

  // ❌ NO long function passed  
  // ⭕ Navigate normally
  const handleDrinkSelect = (drinkId) => {
    router.push({ pathname: "/order-entry", params: { drinkId, timeOfDay }});
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 17) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Coffee size={28} color="#A0522D" />
          <Text style={styles.logoText}>Sip Station</Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuOpen}>
          <Menu size={26} color="#4A2C2A" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        {/* Greeting Block */}
        <View style={styles.heroBlock}>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.taglineText}>What delicious drink will you crave today?</Text>
        </View>

        {/* Time Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}><Clock size={18} color="#A0522D" /> Select Delivery Time</Text>

          <View style={styles.timeSelection}>
            <TouchableOpacity
              style={[styles.timeButton, timeOfDay === 'morning' && styles.timeButtonActive]}
              onPress={() => setTimeOfDay('morning')}
            >
              <Text style={[styles.timeText, timeOfDay === 'morning' && styles.timeTextActive]}>
                ☀️ Morning Slot
              </Text>
              <Text style={[styles.timeSubText, timeOfDay === 'morning' && styles.timeTextActive]}>
                8:00 AM - 12:00 PM
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.timeButton, timeOfDay === 'afternoon' && styles.timeButtonActiveAfternoon]}
              onPress={() => setTimeOfDay('afternoon')}
            >
              <Text style={[styles.timeText, timeOfDay === 'afternoon' && styles.timeTextActive]}>
                🌤️ Afternoon Slot
              </Text>
              <Text style={[styles.timeSubText, timeOfDay === 'afternoon' && styles.timeTextActive]}>
                1:00 PM - 5:00 PM
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Drink Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}><Utensils size={18} color="#A0522D" /> Our Signature Menu</Text>

          <View style={styles.gridWrapper}>
            {DRINKS.map(drink => (
              <TouchableOpacity 
                key={drink.id}
                style={styles.drinkCard}
                onPress={() => handleDrinkSelect(drink.id)}
              >
                <Image source={{ uri: drink.image }} style={styles.drinkImage} resizeMode="cover" />
                <View style={[styles.cardFooter, { backgroundColor: drink.color }]}>
                  <Text style={styles.drinkName}>{drink.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Place Order Button */}
      <TouchableOpacity
        style={[
          styles.cartButton,
          currentOrders.length === 0 && styles.disabledCartButton
        ]}
        disabled={currentOrders.length === 0}
        onPress={handlePlaceOrder}
      >
        <ShoppingCart size={24} color="#FFF" style={{ marginRight: 10 }} />
        <Text style={styles.cartButtonText}>
          Place Order ({currentOrders.length})
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ---------- STYLES (same as your previous version) ---------- */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FDFCFB' },
  container: { flex: 1 },
  contentContainer: { paddingVertical: SPACING },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING - 5,
    backgroundColor: '#FFF',
    shadowColor: '#4A2C2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: { fontSize: 26, fontWeight: '900', color: '#A0522D' },
  menuButton: { padding: 10, borderRadius: 14, backgroundColor: '#F5F3F0' },

  heroBlock: {
    paddingHorizontal: SPACING,
    paddingVertical: 30,
    marginBottom: 20,
    backgroundColor: '#FAF5EE',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#3C2F2F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  greetingText: { fontSize: 32, fontWeight: '800', color: '#3C2F2F' },
  taglineText: { fontSize: 16, color: '#8B4513', fontWeight: '500' },

  section: { marginBottom: 30, paddingHorizontal: SPACING },
  sectionCard: {
    marginHorizontal: SPACING,
    marginBottom: 30,
    padding: SPACING,
    borderRadius: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },

  timeSelection: { flexDirection: 'row', gap: 12 },
  timeButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: '#F7F5F3',
    alignItems: 'center',
  },
  timeButtonActive: { backgroundColor: '#A0522D' },
  timeButtonActiveAfternoon: { backgroundColor: '#8B4513' },
  timeText: { fontSize: 15, fontWeight: '900', color: '#555' },
  timeSubText: { fontSize: 11, fontWeight: '600', color: '#A0A0A0' },
  timeTextActive: { color: '#FFF' },

  gridWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING },
  drinkCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#3C2F2F',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  drinkImage: { width: '100%', flex: 1 },
  cardFooter: { padding: 12, alignItems: 'center' },
  drinkName: { color: '#FFF', fontSize: 16, fontWeight: '800' },

  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginHorizontal: SPACING,
    marginBottom: 15,
    borderRadius: 25,
    backgroundColor: '#FF8C42',
    elevation: 20,
  },
  cartButtonText: { color: '#FFF', fontSize: 19, fontWeight: '900' },
  disabledCartButton: { backgroundColor: '#A0522D60' },
});
