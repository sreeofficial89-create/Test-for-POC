import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchFlights } from "../api/client";

const FlightResultsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { searchParams } = route.params ?? {};

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFlights = async () => {
      try {
        setLoading(true);
        const results = await fetchFlights(searchParams);
        setFlights(results);
        if (results.length === 0) {
          setError("No flights found for your search. Try adjusting filters.");
        } else {
          setError("");
        }
      } catch (err) {
        console.error("Failed to load flights", err);
        setError("Unable to fetch flights. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
  }, [searchParams]);

  const handleSelectFlight = (flight) => {
    navigation.navigate("Booking", {
      bookingItem: {
        type: "flight",
        details: flight,
      },
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 32 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={flights}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          contentContainerStyle={{ paddingVertical: 16 }}
          renderItem={({ item }) => (
            <FlightCard flight={item} onSelect={() => handleSelectFlight(item)} />
          )}
        />
      )}
    </View>
  );
};

const FlightCard = ({ flight, onSelect }) => (
  <TouchableOpacity style={styles.card} onPress={onSelect}>
    <View style={styles.cardHeader}>
      <Text style={styles.airline}>{flight.airline}</Text>
      <Text style={styles.price}>₹{flight.price}</Text>
    </View>
    <View style={styles.timeRow}>
      <View>
        <Text style={styles.time}>{flight.departureTime}</Text>
        <Text style={styles.city}>{flight.from}</Text>
      </View>
      <View style={styles.durationWrap}>
        <Text style={styles.duration}>{flight.duration}</Text>
        <Text style={styles.stops}>{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</Text>
      </View>
      <View>
        <Text style={styles.time}>{flight.arrivalTime}</Text>
        <Text style={styles.city}>{flight.to}</Text>
      </View>
    </View>
    <View style={styles.metaRow}>
      <Text style={styles.metaText}>Cabin: {flight.cabinClass}</Text>
      <Text style={styles.metaText}>Baggage: {flight.baggage?.checkIn}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 32,
    color: "#dc2626",
    textAlign: "center",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  airline: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  time: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  city: {
    color: "#64748b",
  },
  durationWrap: {
    alignItems: "center",
  },
  duration: {
    color: "#0f172a",
    fontWeight: "600",
  },
  stops: {
    color: "#64748b",
    fontSize: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 12,
  },
  metaText: {
    color: "#334155",
    fontSize: 13,
  },
});

export default FlightResultsScreen;
