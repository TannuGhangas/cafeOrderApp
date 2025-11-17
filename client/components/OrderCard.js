// client/components/OrderCard.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Loader, CheckCircle, Clock } from 'lucide-react-native';

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'processing':
      return { color: '#FF8C42', icon: <Loader size={16} color="#FF8C42" /> };
    case 'ready':
    case 'picked up':
      return { color: '#10B981', icon: <CheckCircle size={16} color="#10B981" /> };
    case 'completed':
      return { color: '#666', icon: <CheckCircle size={16} color="#666" /> };
    default:
      return { color: '#333', icon: <Clock size={16} color="#333" /> };
  }
};

const OrderCard = ({ order }) => {
  const statusStyle = getStatusStyle(order.status || 'Pending');
  const totalItems = order.items ? order.items.reduce((sum, item) => sum + item.qty, 0) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {/* Using the last 4 characters of the ID for display */}
        <Text style={styles.orderId}>Order **#{order._id?.slice(-4) || order.orderId}**</Text>
        <View style={[styles.statusBadge, { borderColor: statusStyle.color + '50' }]}>
          {statusStyle.icon}
          <Text style={[styles.statusText, { color: statusStyle.color }]}>{order.status}</Text>
        </View>
      </View>
      <Text style={styles.dateText}>{order.date || 'N/A'} - **{order.slot || 'N/A'}** Slot</Text>

      <View style={styles.itemSummary}>
        {order.items && order.items.slice(0, 2).map((item, index) => (
            <Text key={index} style={styles.itemLine}>
              • {item.qty}x {item.name} ({item.sugar || 'Standard'})
            </Text>
        ))}
        {order.items && order.items.length > 2 && (
             <Text style={styles.itemLine}>... and {order.items.length - 2} more items</Text>
        )}
      </View>

      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>View Details ({totalItems} items)</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
    card: {
      backgroundColor: '#FFF',
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    orderId: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 15,
      borderWidth: 1,
      gap: 5,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    dateText: {
      fontSize: 13,
      color: '#666',
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
      paddingBottom: 8,
    },
    itemSummary: {
      marginBottom: 10,
    },
    itemLine: {
      fontSize: 14,
      color: '#444',
      marginVertical: 1,
    },
    detailsButton: {
      marginTop: 5,
      padding: 8,
      backgroundColor: '#FF8C4215',
      borderRadius: 8,
      alignItems: 'center',
    },
    detailsButtonText: {
      color: '#FF8C42',
      fontWeight: '600',
      fontSize: 14,
    },
});