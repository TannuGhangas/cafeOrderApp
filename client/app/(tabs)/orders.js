// app/(drawer)/Orders.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import {
  RefreshCcw,
  Loader,
  Clock,
  CheckCircle,
  ShoppingCart,
  Menu,
  Coffee
} from 'lucide-react-native';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();

  const handleMenuOpen = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Orders refreshed!');
    }, 1500);
  };

  const OrderCard = ({ order }) => {
    const getStatusStyle = (status) => {
      switch (status) {
        case 'Processing':
          return { color: '#FF8C42', icon: <Loader size={18} color="#FF8C42" /> };
        case 'Ready':
          return { color: '#10B981', icon: <CheckCircle size={18} color="#10B981" /> };
        case 'Completed':
          return { color: '#666', icon: <CheckCircle size={18} color="#666" /> };
        default:
          return { color: '#333', icon: <Clock size={18} color="#333" /> };
      }
    };

    const statusStyle = getStatusStyle(order.status || 'Processing');

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>Order #{order.id || 'Loading...'}</Text>
          <View style={[styles.statusBadge, { borderColor: statusStyle.color + '50' }]}>
            {statusStyle.icon}
            <Text style={[styles.statusText, { color: statusStyle.color }]}>{order.status || 'Processing'}</Text>
          </View>
        </View>

        <Text style={styles.dateText}>Order placed: {order.date || 'Just now'}</Text>

        <Text style={styles.itemLine}>Loading items...</Text>

        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>
            View Details ({order.totalItems || 0} items)
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.customHeader}>
        <View style={styles.logoContainer}>
          <Coffee size={28} color="#A0522D" />
          <Text style={styles.logoText}>Sip Station</Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuOpen}>
          <Menu size={26} color="#4A2C2A" />
        </TouchableOpacity>
      </View>

      <View style={styles.pageContentHeader}>
        <Text style={styles.headerTitle}>Recent Orders</Text>
        <TouchableOpacity onPress={onRefresh} disabled={isRefreshing}>
          {isRefreshing ? <Loader size={26} color="#FF8C42" /> : <RefreshCcw size={26} color="#4A2C2A" />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={styles.listContent}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <ShoppingCart size={50} color="#888" />
            <Text style={styles.emptyText}>No past orders found.</Text>
            <Text style={styles.emptySubText}>Start by selecting a drink from the home screen.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F9' },

  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAE0D7',
    elevation: 2
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: { fontSize: 22, fontWeight: '900', color: '#A0522D' },
  menuButton: { padding: 8, borderRadius: 8, backgroundColor: '#F3F3F5' },

  pageContentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF'
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#4A2C2A' },

  listContent: { padding: 15 },

  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  orderId: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 5
  },
  statusText: { fontSize: 14, fontWeight: '700' },
  dateText: { color: '#666', marginBottom: 10 },
  itemLine: { fontSize: 16, color: '#444', marginBottom: 10 },
  detailsButton: {
    backgroundColor: '#FF8C4215',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  detailsButtonText: { color: '#FF8C42', fontWeight: '700' },

  emptyContainer: { marginTop: 100, alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#888', marginTop: 20 },
  emptySubText: { fontSize: 14, color: '#A0A0A0', marginTop: 5 }
});
