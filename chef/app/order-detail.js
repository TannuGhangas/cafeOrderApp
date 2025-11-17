// chef-app/app/order-detail.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { CheckCircle, Clock, User, Coffee, Zap, Send, Edit } from 'lucide-react-native';

const COLORS = {
    primary: '#4A2C2A',    // Deep Coffee Brown
    secondary: '#B8860B',  // Dark Goldenrod
    textDark: '#333333',
    success: '#3CB371',
    pending: '#FFD700',
    new: '#FF4500',
};

// --- MOCK DETAIL DATA (simulates API response for a specific item) ---
const MOCK_DETAIL_ORDERS = [
    { id: 101, userName: 'Tannu (Marketing)', contact: '987-654-3210', item: 'Espresso Blend', sugar: '1', quantity: 1, status: 'New', time: '8:30 AM' },
    { id: 102, userName: 'Vivek K. (HR)', contact: '999-111-2222', item: 'Espresso Blend', sugar: 'None', quantity: 2, status: 'Processing', time: '8:45 AM' },
    { id: 103, userName: 'Priya S. (Sales)', contact: '888-777-6666', item: 'Espresso Blend', sugar: 'Custom', quantity: 1, status: 'Ready', time: '9:00 AM' },
    // Only includes orders for the selected item (Espresso Blend in this mock)
];
// --- END MOCK DATA ---

const StatusButton = ({ currentStatus, onPress }) => {
    let text, color, icon: JSX.Element;
    
    switch (currentStatus) {
        case 'New':
            text = 'START PROCESSING';
            color = COLORS.new;
            icon = <Zap size={18} color={COLORS.textLight} />;
            break;
        case 'Processing':
            text = 'MARK READY';
            color = COLORS.pending;
            icon = <Edit size={18} color={COLORS.textDark} />;
            break;
        case 'Ready':
            text = 'MARK DELIVERED';
            color = COLORS.success;
            icon = <CheckCircle size={18} color={COLORS.textLight} />;
            break;
        default:
            text = 'Delivered';
            color = '#999';
            icon = <CheckCircle size={18} color={COLORS.textLight} />;
    }
    
    return (
        <TouchableOpacity 
            style={[detailStyles.statusButton, { backgroundColor: color }]}
            onPress={onPress}
            disabled={currentStatus === 'Delivered'}
        >
            {icon}
            <Text style={[detailStyles.statusButtonText, currentStatus === 'Processing' && { color: COLORS.textDark }]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const DetailCard = ({ order, onStatusChange }) => {
    const handleUpdate = () => {
        const nextStatusMap = {
            'New': 'Processing',
            'Processing': 'Ready',
            'Ready': 'Delivered',
        };
        const nextStatus = nextStatusMap[order.status];
        if (nextStatus) {
            onStatusChange(order.id, nextStatus);
        }
    };

    let statusColor;
    switch (order.status) {
        case 'New': statusColor = COLORS.new; break;
        case 'Processing': statusColor = COLORS.pending; break;
        case 'Ready': statusColor = COLORS.success; break;
        default: statusColor = '#999';
    }

    return (
        <View style={detailStyles.card}>
            <View style={detailStyles.cardHeader}>
                <View style={detailStyles.userIcon}>
                    <User size={20} color={COLORS.textLight} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={detailStyles.userName}>{order.userName}</Text>
                    <Text style={detailStyles.orderTime}>Order placed at {order.time}</Text>
                </View>
                <View style={[detailStyles.statusPill, { backgroundColor: statusColor }]}>
                    <Text style={detailStyles.statusPillText}>{order.status}</Text>
                </View>
            </View>
            
            <View style={detailStyles.detailRow}>
                <Text style={detailStyles.detailLabel}>ITEM:</Text>
                <Text style={detailStyles.detailValue}>{order.item}</Text>
            </View>
            <View style={detailStyles.detailRow}>
                <Text style={detailStyles.detailLabel}>QTY / SUGAR:</Text>
                <Text style={detailStyles.detailValue}>{order.quantity} unit(s) / {order.sugar}</Text>
            </View>

            <StatusButton 
                currentStatus={order.status} 
                onPress={handleUpdate} 
            />
        </View>
    );
};


export default function OrderDetail() {
    const params = useLocalSearchParams();
    const { item, timeSlot } = params;
    
    const [orders, setOrders] = useState(MOCK_DETAIL_ORDERS);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // In a real app: fetch details using item and timeSlot from params
        setIsLoading(true);
        setTimeout(() => {
            setOrders(MOCK_DETAIL_ORDERS); // Use mock data for now
            setIsLoading(false);
        }, 800);
    }, [item, timeSlot]);

    // Handles state update locally (will call API in real integration)
    const handleStatusChange = (orderId, newStatus) => {
        // 1. Update local state immediately for fast feedback
        setOrders(prev => prev.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        
        // 2. 🚨 Future: Call API to persist the change 🚨
        // updateOrderStatus({ orderId, newStatus });
    };

    if (isLoading) {
        return (
            <View style={[detailStyles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 10, color: COLORS.textDark }}>Loading queue details...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={detailStyles.container}>
            <Stack.Screen options={{ 
                title: `${item} Queue (${timeSlot})`,
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: COLORS.textLight,
            }} />
            
            <View style={detailStyles.summaryBar}>
                <Text style={detailStyles.summaryText}>Total {item}: {orders.reduce((sum, o) => sum + o.quantity, 0)}</Text>
            </View>

            <FlatList
                data={orders.sort((a, b) => (a.status === 'New' ? -1 : 1))} // Prioritize 'New' orders
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item: order }) => <DetailCard order={order} onStatusChange={handleStatusChange} />}
                contentContainerStyle={detailStyles.listContent}
            />
        </SafeAreaView>
    );
}

const detailStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8F8' },
    listContent: { padding: 15 },
    summaryBar: {
        backgroundColor: COLORS.secondary,
        padding: 15,
        alignItems: 'center',
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textLight,
    },
    card: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderLeftWidth: 5,
        borderLeftColor: COLORS.primary,
        shadowColor: COLORS.textDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    userIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textDark,
    },
    orderTime: {
        fontSize: 12,
        color: '#666',
    },
    statusPill: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 15,
        minWidth: 80,
        alignItems: 'center',
    },
    statusPillText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textLight,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    detailLabel: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: 'bold',
        width: 120,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textDark,
        flex: 1,
        textAlign: 'right',
    },
    statusButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        marginTop: 15,
        gap: 8,
    },
    statusButtonText: {
        fontSize: 16,
        fontWeight: '900',
        color: COLORS.textLight,
    },
});