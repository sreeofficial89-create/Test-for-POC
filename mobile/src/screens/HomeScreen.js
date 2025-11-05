import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  fetchDestinations,
  fetchExperiences,
  fetchOffers,
} from "../api/client";

const tripModes = [
  { id: "flights", label: "Flights" },
  { id: "hotels", label: "Hotels" },
  { id: "experiences", label: "Experiences" },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [activeMode, setActiveMode] = useState("flights");
  const [form, setForm] = useState({
    from: "DEL",
    to: "GOI",
    departureDate: "2025-12-22",
    returnDate: "2025-12-28",
    travellers: "2",
  });
  const [destinations, setDestinations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [destList, offersList, experienceList] = await Promise.all([
          fetchDestinations({}),
          fetchOffers(),
          fetchExperiences({}),
        ]);
        setDestinations(destList);
        setOffers(offersList);
        setExperiences(experienceList.slice(0, 6));
        setError("");
      } catch (err) {
        console.error("Failed to load home content", err);
        setError("Unable to load travel inspiration. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSearch = () => {
    if (activeMode === "flights") {
      navigation.navigate("FlightResults", {
        searchParams: {
          from: form.from.trim(),
          to: form.to.trim(),
          date: form.departureDate.trim(),
        },
      });
    } else if (activeMode === "hotels") {
      navigation.navigate("HotelResults", {
        searchParams: {
          destinationId: form.to.trim().toLowerCase().startsWith("dest-")
            ? form.to.trim()
            : undefined,
          keyword: form.to.trim(),
        },
      });
    } else {
      navigation.navigate("HotelResults", {
        searchParams: { destinationId: null, keyword: form.to.trim() },
        showExperiences: true,
      });
    }
  };

  const onChangeField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.greeting}>Plan Your Next Getaway</Text>
        <Text style={styles.subtitle}>Search flights, stays, and curated experiences</Text>

        <View style={styles.modeSelector}>
          {tripModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeButton, activeMode === mode.id && styles.modeButtonActive]}
              onPress={() => setActiveMode(mode.id)}
            >
              <Text
                style={[styles.modeLabel, activeMode === mode.id && styles.modeLabelActive]}
              >
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formLabel}>From</Text>
          <TextInput
            style={styles.input}
            value={form.from}
            onChangeText={(value) => onChangeField("from", value)}
            placeholder="City or airport code"
          />

          <Text style={styles.formLabel}>To</Text>
          <TextInput
            style={styles.input}
            value={form.to}
            onChangeText={(value) => onChangeField("to", value)}
            placeholder="City, airport, or destination"
          />

          <View style={styles.inlineGroup}>
            <View style={[styles.inlineField, styles.inlineFieldSpacing]}>
              <Text style={styles.formLabel}>Departure</Text>
              <TextInput
                style={styles.input}
                value={form.departureDate}
                onChangeText={(value) => onChangeField("departureDate", value)}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={styles.inlineField}>
              <Text style={styles.formLabel}>Return</Text>
              <TextInput
                style={styles.input}
                value={form.returnDate}
                onChangeText={(value) => onChangeField("returnDate", value)}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>

          <Text style={styles.formLabel}>Travellers & Class</Text>
          <TextInput
            style={styles.input}
            value={form.travellers}
            onChangeText={(value) => onChangeField("travellers", value)}
            placeholder="2 Adults, Economy"
          />

          <TouchableOpacity style={styles.ctaButton} onPress={handleSearch}>
            <Text style={styles.ctaText}>
              {activeMode === "flights"
                ? "Search Flights"
                : activeMode === "hotels"
                ? "Search Stays"
                : "Explore Experiences"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Destinations</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#2563eb" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={destinations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <DestinationCard item={item} />}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            contentContainerStyle={{ paddingVertical: 6 }}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Limited Time Offers</Text>
        <View>
          {offers.map((offer) => (
            <View key={offer.id} style={styles.offerCard}>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerDescription}>{offer.description}</Text>
              <Text style={styles.offerCode}>Use code {offer.code}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.section, { paddingBottom: 32 }]}>
        <Text style={styles.sectionTitle}>Curated Experiences</Text>
        <View>
          {experiences.map((item) => (
            <View key={item.id} style={styles.experienceCard}>
              <Image source={{ uri: item.image }} style={styles.experienceImage} />
              <View style={styles.experienceInfo}>
                <Text style={styles.experienceTitle}>{item.title}</Text>
                <Text style={styles.experienceSubtitle}>{item.category}</Text>
                <Text style={styles.experiencePrice}>₹{item.price}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const DestinationCard = ({ item }) => (
  <View style={styles.destinationCard}>
    <Image source={{ uri: item.heroImage }} style={styles.destinationImage} />
    <View style={styles.destinationOverlay}>
      <Text style={styles.destinationName}>{item.name}</Text>
      <Text style={styles.destinationMeta}>{item.country}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  hero: {
    backgroundColor: "#0b1120",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 32,
  },
  greeting: {
    color: "#f9fafb",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 18,
  },
  modeSelector: {
    flexDirection: "row",
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#2563eb",
  },
  modeLabel: {
    color: "#94a3b8",
    fontWeight: "600",
  },
  modeLabelActive: {
    color: "#f8fafc",
  },
  formCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
  },
  formLabel: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#0f172a",
    marginBottom: 12,
  },
  inlineGroup: {
    flexDirection: "row",
  },
  inlineField: {
    flex: 1,
  },
  inlineFieldSpacing: {
    marginRight: 12,
  },
  ctaButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  ctaText: {
    color: "#f8fafc",
    fontWeight: "700",
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  errorText: {
    color: "#dc2626",
  },
  destinationCard: {
    width: 180,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1e293b",
  },
  destinationImage: {
    width: "100%",
    height: "100%",
  },
  destinationOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
  },
  destinationName: {
    color: "#f8fafc",
    fontWeight: "700",
    fontSize: 16,
  },
  destinationMeta: {
    color: "#cbd5f5",
  },
  offerCard: {
    backgroundColor: "#eef2ff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  offerTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1e3a8a",
  },
  offerDescription: {
    color: "#312e81",
    marginVertical: 6,
  },
  offerCode: {
    color: "#4338ca",
    fontWeight: "700",
  },
  experienceCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  experienceImage: {
    width: 110,
    height: 110,
  },
  experienceInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  experienceTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#0f172a",
  },
  experienceSubtitle: {
    color: "#64748b",
    marginVertical: 4,
  },
  experiencePrice: {
    color: "#2563eb",
    fontWeight: "700",
  },
});

export default HomeScreen;
