"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { User, Prediction, Country, Result } from "@/lib/supabase/types";
import { countries as countriesData } from "@/lib/data/countries";
import {
  getUsers,
  getCountries,
  getUserPredictions,
  getResults,
} from "@/lib/supabase/client";
import { CountryList } from "@/components/prediction/CountryList";
import { Scoreboard } from "@/components/results/Scoreboard";
import { LoginForm } from "@/components/auth/LoginForm";

type UserWithPredictions = {
  user: User;
  predictions: Prediction[];
};

export default function Results() {
  const { user, isLoading } = useAuth();
  const [usersWithPredictions, setUsersWithPredictions] = useState<
    UserWithPredictions[]
  >([]);
  const [countries, setCountries] = useState<Country[]>(countriesData);
  const [results, setResults] = useState<Result[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setIsLoadingData(true);
      try {
        // Lade alle Benutzer, Länder und Ergebnisse
        const [allUsers, fetchedCountries, fetchedResults] = await Promise.all([
          getUsers(),
          getCountries(),
          getResults(),
        ]);

        setCountries(fetchedCountries || countriesData);
        setResults(fetchedResults || []);

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
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  const resultsForCountryList = results.map((result) => ({
    country_id: result.country_id,
    position: result.position,
    id: result.id,
    created_at: "",
    user_id: "",
  }));

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
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Ergebnisse</h1>

      {isLoadingData ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-gray-500">Daten werden geladen...</p>
        </div>
      ) : (
        <>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <CountryList
                  countries={countries}
                  predictions={resultsForCountryList}
                  onSavePrediction={async () => {}} // Leere Funktion, da schreibgeschützt
                  isReadOnly={true}
                />
              </div>

              <div>
                <Scoreboard
                  usersWithPredictions={usersWithPredictions}
                  results={results}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              Noch keine Ergebnisse verfügbar. Der Administrator muss zuerst die
              finalen Platzierungen eintragen.
            </p>
          )}
        </>
      )}
    </div>
  );
}
