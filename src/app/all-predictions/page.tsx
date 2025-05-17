"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { User, Prediction, Country } from "@/lib/supabase/types";
import { countries as countriesData } from "@/lib/data/countries";
import {
  getUsers,
  getCountries,
  getUserPredictions,
} from "@/lib/supabase/client";
import { CountryList } from "@/components/prediction/CountryList";
import { LoginForm } from "@/components/auth/LoginForm";

type UserWithPredictions = {
  user: User;
  predictions: Prediction[];
};

export default function AllPredictions() {
  const { user, isLoading } = useAuth();
  const [usersWithPredictions, setUsersWithPredictions] = useState<
    UserWithPredictions[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>(countriesData);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setIsLoadingData(true);
      try {
        // Lade alle Benutzer und Länder
        const [allUsers, fetchedCountries] = await Promise.all([
          getUsers(),
          getCountries(),
        ]);

        setCountries(fetchedCountries || countriesData);

        // Lade die Vorhersagen für jeden Benutzer
        const usersWithPredictionsData: UserWithPredictions[] = [];

        for (const u of allUsers) {
          const predictions = await getUserPredictions(u.id);
          usersWithPredictionsData.push({
            user: u,
            predictions: predictions || [],
          });
        }

        setUsersWithPredictions(usersWithPredictionsData);

        // Setze den ersten Benutzer als ausgewählt, falls vorhanden und nicht der eigene
        const otherUsers = usersWithPredictionsData.filter(
          (u) => u.user.id !== user.id
        );
        if (otherUsers.length > 0) {
          setSelectedUserId(otherUsers[0].user.id);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  const selectedUserPredictions =
    usersWithPredictions.find((u) => u.user.id === selectedUserId)
      ?.predictions || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">Wird geladen...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Alle Vorhersagen</h1>

      {isLoadingData ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-gray-500">Daten werden geladen...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label
              htmlFor="user-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Benutzer auswählen:
            </label>
            <select
              id="user-select"
              value={selectedUserId || ""}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Benutzer auswählen</option>
              {usersWithPredictions
                .filter((u) => u.user.id !== user.id) // Eigenen Benutzer ausschließen
                .map((u) => (
                  <option key={u.user.id} value={u.user.id}>
                    {u.user.name}
                  </option>
                ))}
            </select>
          </div>

          {selectedUserId ? (
            <CountryList
              countries={countries}
              predictions={selectedUserPredictions}
              onSavePrediction={async () => {}} // Leere Funktion, da schreibgeschützt
              isReadOnly={true}
            />
          ) : (
            <p className="text-gray-500">
              Bitte wähle einen Benutzer aus, um seine Vorhersagen zu sehen.
            </p>
          )}
        </>
      )}
    </div>
  );
}
