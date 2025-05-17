"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { CountryList } from "@/components/prediction/CountryList";
import { Country, Prediction } from "@/lib/supabase/types";
import { countries } from "@/lib/data/countries";
import {
  getCountries,
  getUserPredictions,
  savePrediction,
} from "@/lib/supabase/client";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [userPredictions, setUserPredictions] = useState<Prediction[]>([]);
  const [countriesList, setCountriesList] = useState<Country[]>(countries);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setIsLoadingData(true);
      try {
        // Lade Länder und Vorhersagen des Benutzers
        const [fetchedCountries, predictions] = await Promise.all([
          getCountries(),
          getUserPredictions(user.id),
        ]);

        setCountriesList(fetchedCountries || countries);
        setUserPredictions(predictions || []);
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSavePrediction = async (countryId: number, position: number) => {
    if (!user) return;

    try {
      await savePrediction(user.id, countryId, position);

      // Aktualisiere die Vorhersagen im lokalen Zustand
      const updatedPredictions = [...userPredictions];
      const existingIndex = updatedPredictions.findIndex(
        (p) => p.country_id === countryId
      );

      if (existingIndex >= 0) {
        updatedPredictions[existingIndex].position = position;
      } else {
        updatedPredictions.push({
          id: Date.now(), // Temporäre ID
          created_at: new Date().toISOString(),
          user_id: user.id,
          country_id: countryId,
          position,
        });
      }

      setUserPredictions(updatedPredictions);
    } catch (error) {
      console.error("Fehler beim Speichern der Vorhersage:", error);
    }
  };

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
      <h1 className="text-2xl font-bold">Eurovision Song Contest Tippspiel</h1>

      {isLoadingData ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-gray-500">Daten werden geladen...</p>
        </div>
      ) : (
        <CountryList
          countries={countriesList}
          predictions={userPredictions}
          onSavePrediction={handleSavePrediction}
        />
      )}
    </div>
  );
}
