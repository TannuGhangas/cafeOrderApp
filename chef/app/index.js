// chef-app/app/index.js (Chef Dashboard)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Utensils, Clock, Coffee, Droplet, Loader, CheckCircle } from 'lucide-react-native';
// import { fetchAggregatedOrders } from '../utils/api'; // (Future integration)

const MOCK_AGGREGATED_ORDERS = [
    { item: 'Espresso Blend', quantity: 4, icon: Coffee, status: 'New', timeSlot: 'Morning' },
    { item: 'Herbal Tea', quantity: 2, icon: Utensils, status: 'Processing', timeSlot: 'Morning' },
    { item: 'Filtered Water', quantity: 3, icon: Droplet, status: 'New', timeSlot: 'Morning' },
    { item: 'Americano', quantity: 1, icon: Coffee, status: 'Ready', timeSlot: 'Afternoon' },
];

const AggregatedCard = ({ order, router }) => {
    const handlePress = () => {
        router.push({
            pathname: '/order-detail',
            params: { 
                item: order.item, 
                timeSlot: order.timeSlot,
                // In a real app, you'd pass the item ID and timeSlot ID
            }
        });
    };

    const StatusIcon = order.status === 'New' ? <Clock size={20} color="#FF4500" /> : 
                       order.status === 'Processing' ? <Loader size={20} color="#FFD700" /> :
                       <CheckCircle size={20} color="#3CB371" />;

    return (
        <TouchableOpacity style={chefStyles.card} onPress={handlePress}>
            <View style={chefStyles.cardHeader}>
                {order.icon && <order.icon size={30} color="#4A2C2A" />}
                <Text style={chefStyles.itemText}>{order.item}</Text>
            </View>
            <View style={chefStyles.cardBody}>
                <Text style={chefStyles.quantityText}>{order.quantity}</Text>
                <Text style={chefStyles.unitText}>TOTAL ORDERS</Text>
            </View>
            <View style={chefStyles.cardFooter}>
                {StatusIcon}
                <Text style={[chefStyles.statusText, { color: order.status === 'New' ? '#FF4500' : '#4A2C2A' }]}>
                    {order.status} ({order.timeSlot})
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default function ChefDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState(MOCK_AGGREGATED_ORDERS);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Placeholder for API call
    const fetchOrders = () => {
        setIsRefreshing(true);
        // In a real app: const data = await fetchAggregatedOrders(); setOrders(data);
        setTimeout(() => {
            setOrders(MOCK_AGGREGATED_ORDERS);
            setIsRefreshing(false);
        }, 1500);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <SafeAreaView style={chefStyles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#4A2C2A" />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={chefStyles.customHeader}>
                <Text style={chefStyles.headerTitle}>Kitchen Queue</Text>
                <Text style={chefStyles.headerDate}>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item, index) => item.item + index}
                renderItem={({ item }) => <AggregatedCard order={item} router={router} />}
                numColumns={2}
                contentContainerStyle={chefStyles.listContent}
                columnWrapperStyle={chefStyles.columnWrapper}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={fetchOrders}
                        tintColor="#4A2C2A"
                    />
                }
            />
        </SafeAreaView>
    );
}

const chefStyles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8F8F8' },
    customHeader: {
        backgroundColor: '#4A2C2A',
        padding: 20,
        paddingTop: 50,
        marginBottom: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    headerDate: {
        fontSize: 16,
        color: '#E0E0E0',
    },
    listContent: {
        padding: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    card: {
        flex: 1,
        margin: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        borderLeftWidth: 5,
        borderLeftColor: '#B8860B', // Gold accent
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    itemText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4A2C2A',
        marginLeft: 10,
    },
    cardBody: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    quantityText: {
        fontSize: 48,
        fontWeight: '900',
        color: '#4A2C2A',
    },
    unitText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#999',
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    statusText: {
        marginLeft: 8,
        fontWeight: '700',
        fontSize: 14,
    },
});