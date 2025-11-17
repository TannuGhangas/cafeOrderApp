import React from "react";
import { Stack } from "expo-router";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="order-entry" options={{ headerShown: false }} />
        <Stack.Screen name="order-placed" options={{ headerShown: false }} />
      </Stack>
    </CartProvider>
  );
}
