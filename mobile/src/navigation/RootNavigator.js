import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import FlightResultsScreen from "../screens/FlightResultsScreen";
import HotelResultsScreen from "../screens/HotelResultsScreen";
import BookingScreen from "../screens/BookingScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";

const Stack = createNativeStackNavigator();

const RootNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FlightResults"
        component={FlightResultsScreen}
        options={{ title: "Flight Results" }}
      />
      <Stack.Screen
        name="HotelResults"
        component={HotelResultsScreen}
        options={{ title: "Stay Options" }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ title: "Review & Book" }}
      />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;
