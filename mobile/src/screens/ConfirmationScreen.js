import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";

const ConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { booking } = route.params ?? {};

  const handleGoHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
  };

  if (!booking) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Booking confirmed!</Text>
        <Text style={styles.subtitle}>You can review the details from the bookings tab.</Text>
        <TouchableOpacity style={styles.cta} onPress={handleGoHome}>
          <Text style={styles.ctaText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You're booked!</Text>
      <Text style={styles.subtitle}>Booking reference {booking.id}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{booking.itinerary.type.toUpperCase()}</Text>
        <Text style={styles.cardText}>Status: {booking.status}</Text>
        <Text style={styles.cardText}>Booked on {new Date(booking.bookedAt).toLocaleString()}</Text>
        <Text style={styles.cardText}>Traveller: {booking.user.name}</Text>
        <Text style={styles.cardText}>Email: {booking.user.email}</Text>
        <Text style={styles.cardText}>Amount Paid: ₹{booking.payment.amount}</Text>
      </View>
      <TouchableOpacity style={styles.cta} onPress={handleGoHome}>
        <Text style={styles.ctaText}>Search More Trips</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#f8fafc",
  },
  subtitle: {
    color: "#cbd5f5",
    textAlign: "center",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
    width: "100%",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e2e8f0",
  },
  cardText: {
    color: "#cbd5f5",
    marginTop: 6,
  },
  cta: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  ctaText: {
    color: "#f8fafc",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default ConfirmationScreen;
