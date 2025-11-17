// server/services/fcmService.js

// Firebase Cloud Messaging (FCM) functionality is permanently removed/mocked.

const sendNewOrderNotification = async (order) => {
    console.log(`[MOCK NOTIFICATION] New order placed by ${order.userName}. Notification service is disabled.`);
    return Promise.resolve({ success: true, message: 'FCM disabled' });
  };
  
  module.exports = {
    sendNewOrderNotification,
  };