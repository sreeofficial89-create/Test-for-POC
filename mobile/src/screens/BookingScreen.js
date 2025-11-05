import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createBooking } from "../api/client";

const BookingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingItem } = route.params ?? {};

  const [form, setForm] = useState({
    name: "Sparsh Gupta",
    email: "sparsh.gupta@bajajfinserv.in",
    phone: "+91 99999 99999",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  if (!bookingItem) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No booking information found.</Text>
      </View>
    );
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const payload = {
        user: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        itinerary: {
          type: bookingItem.type,
          details: bookingItem.details,
        },
        payment: {
          method: "upi",
          amount: resolvePrice(bookingItem),
          currency: "INR",
          status: "pending",
        },
        notes: form.notes,
      };

      const booking = await createBooking(payload);
      navigation.replace("Confirmation", { booking });
    } catch (err) {
      console.error("Booking failed", err);
      Alert.alert("Booking failed", "We could not place your booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Trip Summary</Text>
        <Summary bookingItem={bookingItem} />
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Traveller Details</Text>
        <InputField
          label="Full Name"
          value={form.name}
          onChangeText={(value) => handleChange("name", value)}
        />
        <InputField
          label="Email"
          value={form.email}
          onChangeText={(value) => handleChange("email", value)}
          keyboardType="email-address"
        />
        <InputField
          label="Phone"
          value={form.phone}
          onChangeText={(value) => handleChange("phone", value)}
          keyboardType="phone-pad"
        />
        <InputField
          label="Special Requests"
          value={form.notes}
          onChangeText={(value) => handleChange("notes", value)}
          multiline
        />
      </View>

      <TouchableOpacity
        style={[styles.ctaButton, loading && { opacity: 0.6 }]}
        onPress={handleConfirm}
        disabled={loading}
      >
        <Text style={styles.ctaText}>{loading ? "Processing..." : "Confirm & Pay"}</Text>
        <Text style={styles.ctaSubText}>Total ₹{resolvePrice(bookingItem)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Summary = ({ bookingItem }) => {
  if (bookingItem.type === "flight") {
    const flight = bookingItem.details;
    return (
      <View style={styles.summaryBlock}>
        <Text style={styles.summaryTitle}>{flight.airline}</Text>
        <Text style={styles.summaryLine}>
          {flight.from} → {flight.to} | {flight.date}
        </Text>
        <Text style={styles.summaryLine}>
          {flight.departureTime} - {flight.arrivalTime} ({flight.duration})
        </Text>
        <Text style={styles.summaryPrice}>Fare: ₹{flight.price}</Text>
      </View>
    );
  }

  if (bookingItem.type === "hotel") {
    const hotel = bookingItem.details;
    return (
      <View style={styles.summaryBlock}>
        <Text style={styles.summaryTitle}>{hotel.name}</Text>
        <Text style={styles.summaryLine}>{hotel.location}</Text>
        <Text style={styles.summaryLine}>Rating {hotel.rating} ⭐</Text>
        <Text style={styles.summaryPrice}>₹{hotel.pricePerNight} per night</Text>
      </View>
    );
  }

  const experience = bookingItem.details;
  return (
    <View style={styles.summaryBlock}>
      <Text style={styles.summaryTitle}>{experience.title}</Text>
      <Text style={styles.summaryLine}>{experience.duration}</Text>
      <Text style={styles.summaryLine}>{experience.category}</Text>
      <Text style={styles.summaryPrice}>₹{experience.price}</Text>
    </View>
  );
};

const InputField = ({ label, ...props }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, props.multiline && { height: 90, textAlignVertical: "top" }]}
      placeholder={label}
      {...props}
    />
  </View>
);

const resolvePrice = (bookingItem) => {
  if (bookingItem.type === "flight") return bookingItem.details.price;
  if (bookingItem.type === "hotel") return bookingItem.details.pricePerNight;
  if (bookingItem.type === "experience") return bookingItem.details.price;
  return 0;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  errorText: {
    color: "#dc2626",
    marginTop: 32,
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  summaryBlock: {
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  summaryLine: {
    color: "#475569",
    fontSize: 14,
  },
  summaryPrice: {
    color: "#2563eb",
    fontWeight: "700",
    marginTop: 8,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  label: {
    color: "#0f172a",
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#0f172a",
  },
  ctaButton: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 24,
  },
  ctaText: {
    color: "#f8fafc",
    fontWeight: "700",
    fontSize: 16,
  },
  ctaSubText: {
    color: "#bfdbfe",
    marginTop: 4,
  },
});

export default BookingScreen;
