"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Country, Result } from "@/lib/supabase/types";
import { countries as countriesData } from "@/lib/data/countries";
import { getCountries, getResults, saveResult } from "@/lib/supabase/client";
import { CountryList } from "@/components/prediction/CountryList";
import { LoginForm } from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";

export default function Admin() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>(countriesData);
  const [results, setResults] = useState<Result[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Wenn der Benutzer kein Admin ist, zur Hauptseite weiterleiten
      if (!user.is_admin) {
        router.push("/");
        return;
      }

      setIsLoadingData(true);
      try {
        // Lade Länder und bestehende Ergebnisse
        const [fetchedCountries, fetchedResults] = await Promise.all([
          getCountries(),
          getResults(),
        ]);

        setCountries(fetchedCountries || countriesData);
        setResults(fetchedResults || []);
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleSaveResult = async (countryId: number, position: number) => {
    if (!user?.is_admin) return;

    try {
      await saveResult(countryId, position);

      // Aktualisiere die Ergebnisse im lokalen Zustand
      const updatedResults = [...results];
      const existingIndex = updatedResults.findIndex(
        (r) => r.country_id === countryId
      );

      if (existingIndex >= 0) {
        updatedResults[existingIndex].position = position;
      } else {
        updatedResults.push({
          id: Date.now(), // Temporäre ID
          country_id: countryId,
          position,
        });
      }

      setResults(updatedResults);
    } catch (error) {
      console.error("Fehler beim Speichern des Ergebnisses:", error);
    }
  };

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

  if (!user.is_admin) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500">
          Zugriff verweigert. Du bist kein Administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin-Bereich</h1>
      </div>

      {isLoadingData ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-gray-500">Daten werden geladen...</p>
        </div>
      ) : (
        <div className="max-w-4xl">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Als Administrator kannst du hier die finalen Ergebnisse des
                  Eurovision Song Contest eintragen. Diese werden dann zur
                  Berechnung der Punktestände aller Teilnehmer verwendet.
                </p>
              </div>
            </div>
          </div>

          <CountryList
            countries={countries}
            predictions={resultsForCountryList}
            onSavePrediction={handleSaveResult}
            isAdmin={true}
          />
        </div>
      )}
    </div>
  );
}
