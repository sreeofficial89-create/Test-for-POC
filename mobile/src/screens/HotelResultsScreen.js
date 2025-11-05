import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  fetchHotels,
  fetchDestinations,
  fetchExperiences,
} from "../api/client";

const HotelResultsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { searchParams, showExperiences = false } = route.params ?? {};

  const [hotels, setHotels] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resolvedDestination, setResolvedDestination] = useState(null);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true);
        let destinationId = searchParams?.destinationId;
        let destination = null;

        if (destinationId) {
          const allDestinations = await fetchDestinations({});
          destination = allDestinations.find((item) => item.id === destinationId) ?? null;
        } else if (searchParams?.keyword) {
          const potentialDestinations = await fetchDestinations({ search: searchParams.keyword });
          destination = potentialDestinations?.[0] ?? null;
          destinationId = destination?.id;
        }

        setResolvedDestination(destination);

        const [hotelResults, experienceResults] = await Promise.all([
          fetchHotels({ destinationId }),
          showExperiences && destinationId
            ? fetchExperiences({ destinationId })
            : Promise.resolve([]),
        ]);

        setHotels(hotelResults);
        setExperiences(experienceResults);
        if (hotelResults.length === 0) {
          setError("No stays found. Try a different location or dates.");
        } else {
          setError("");
        }
      } catch (err) {
        console.error("Failed to load hotels", err);
        setError("Unable to fetch hotels right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, [searchParams, showExperiences]);

  const handleSelectHotel = (hotel) => {
    navigation.navigate("Booking", {
      bookingItem: {
        type: "hotel",
        details: hotel,
        destination: resolvedDestination,
      },
    });
  };

  const handleSelectExperience = (experience) => {
    navigation.navigate("Booking", {
      bookingItem: {
        type: "experience",
        details: experience,
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
          data={hotels}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          ListHeaderComponent={
            resolvedDestination ? (
              <View style={styles.headerBanner}>
                <Text style={styles.bannerTitle}>{resolvedDestination.name}</Text>
                <Text style={styles.bannerSubtitle}>{resolvedDestination.description}</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <HotelCard hotel={item} onSelect={() => handleSelectHotel(item)} />
          )}
          ListFooterComponent={
            experiences.length > 0 ? (
              <View style={{ marginTop: 24 }}>
                <Text style={styles.sectionTitle}>Experiences you might like</Text>
                {experiences.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    experience={experience}
                    onSelect={() => handleSelectExperience(experience)}
                  />
                ))}
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const HotelCard = ({ hotel, onSelect }) => (
  <TouchableOpacity style={styles.card} onPress={onSelect}>
    <Image source={{ uri: hotel.images?.[0] }} style={styles.hotelImage} />
    <View style={styles.cardBody}>
      <Text style={styles.hotelName}>{hotel.name}</Text>
      <Text style={styles.hotelMeta}>{hotel.location}</Text>
      <Text style={styles.hotelMeta}>⭐ {hotel.rating} ({hotel.reviews} reviews)</Text>
      <Text style={styles.hotelPrice}>₹{hotel.pricePerNight} / night</Text>
      <Text style={styles.hotelAmenities}>{hotel.amenities?.slice(0, 3).join(" • ")}</Text>
    </View>
  </TouchableOpacity>
);

const ExperienceCard = ({ experience, onSelect }) => (
  <TouchableOpacity style={styles.experienceCard} onPress={onSelect}>
    <Image source={{ uri: experience.image }} style={styles.experienceImage} />
    <View style={styles.experienceBody}>
      <Text style={styles.experienceTitle}>{experience.title}</Text>
      <Text style={styles.experienceCategory}>{experience.category}</Text>
      <Text style={styles.experiencePrice}>₹{experience.price}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 32,
    color: "#dc2626",
    textAlign: "center",
    fontSize: 16,
  },
  headerBanner: {
    backgroundColor: "#e0f2fe",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  bannerSubtitle: {
    color: "#0f172a",
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
  },
  hotelImage: {
    width: "100%",
    height: 180,
  },
  cardBody: {
    padding: 16,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  hotelMeta: {
    color: "#64748b",
    fontSize: 13,
  },
  hotelPrice: {
    color: "#2563eb",
    fontWeight: "700",
    marginTop: 8,
  },
  hotelAmenities: {
    color: "#475569",
    marginTop: 4,
  },
  experienceCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  experienceImage: {
    width: 110,
    height: 110,
  },
  experienceBody: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  experienceTitle: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: 16,
  },
  experienceCategory: {
    color: "#64748b",
    marginVertical: 4,
  },
  experiencePrice: {
    color: "#2563eb",
    fontWeight: "700",
  },
});

export default HotelResultsScreen;
