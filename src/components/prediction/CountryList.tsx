"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Country, Prediction } from "@/lib/supabase/types";

type CountryListProps = {
  countries: Country[];
  predictions: Prediction[];
  onSavePrediction: (countryId: number, position: number) => Promise<void>;
  isAdmin?: boolean;
  isReadOnly?: boolean;
};

export const CountryList: React.FC<CountryListProps> = ({
  countries,
  predictions,
  onSavePrediction,
  isAdmin = false,
  isReadOnly = false,
}) => {
  const [selectedPositions, setSelectedPositions] = useState<
    Record<number, number>
  >({});
  const [sortBy, setSortBy] = useState<"name" | "position">("name");

  useEffect(() => {
    // Initialisiere die ausgewählten Positionen aus den Vorhersagen
    const positions: Record<number, number> = {};
    predictions.forEach((prediction) => {
      positions[prediction.country_id] = prediction.position;
    });
    setSelectedPositions(positions);
  }, [predictions]);

  const handlePositionChange = async (countryId: number, position: number) => {
    if (isReadOnly) return;

    setSelectedPositions((prev) => ({
      ...prev,
      [countryId]: position,
    }));

    await onSavePrediction(countryId, position);
  };

  const sortedCountries = [...countries].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    // Nach Position sortieren
    const posA = selectedPositions[a.id] || 999;
    const posB = selectedPositions[b.id] || 999;
    return posA - posB;
  });

  const generatePositionOptions = () => {
    const options = [];
    for (let i = 1; i <= 26; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-y-3 sm:flex-row sm:justify-between sm:items-center mb-6 px-1">
        <h2 className="text-2xl font-bold text-slate-700">
          {isAdmin
            ? "Ergebnisse eintragen"
            : isReadOnly
            ? "Tipps"
            : "Meine Tipps"}
        </h2>
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="text-sm text-slate-600">Sortieren nach:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "position")}
            className="bg-white bg-opacity-70 backdrop-blur-sm border border-slate-300 rounded-md px-3 py-1.5 text-sm text-slate-700 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors shadow-sm hover:border-slate-400"
          >
            <option value="name">Name</option>
            <option value="position">Position</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:gap-5">
        {sortedCountries.map((country) => (
          <div
            key={country.id}
            className="flex flex-col md:flex-row md:items-center p-4 bg-white bg-opacity-50 backdrop-blur-md rounded-xl shadow-lg border border-white border-opacity-30 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4 flex-1 mb-3 md:mb-0">
              <div className="w-10 h-7 relative overflow-hidden rounded-md border border-gray-200 shadow-sm">
                <Image
                  src={`https://flagcdn.com/w80/${country.flag_code}.png`}
                  alt={`Flagge von ${country.name}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg text-slate-800">
                  {country.name}
                </span>
                <div className="text-xs text-slate-600 tracking-wide">
                  {country.artist && (
                    <span className="block md:inline">{country.artist}</span>
                  )}
                  {country.artist && country.song && (
                    <span className="hidden md:inline"> - </span>
                  )}
                  {country.song && (
                    <span className="italic block md:inline">
                      "{country.song}"
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2 md:mt-0 md:ml-4">
              {isReadOnly ? (
                <span className="px-4 py-2 bg-slate-100 bg-opacity-80 rounded-lg font-medium text-slate-700 text-sm shadow-sm">
                  {selectedPositions[country.id] || "-"}
                </span>
              ) : (
                <select
                  value={selectedPositions[country.id] || ""}
                  onChange={(e) =>
                    handlePositionChange(country.id, Number(e.target.value))
                  }
                  className="w-full md:w-auto bg-white bg-opacity-70 backdrop-blur-sm border border-slate-300 rounded-md px-3 py-1.5 text-slate-700 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors shadow-sm hover:border-slate-400 text-sm"
                  disabled={isReadOnly}
                >
                  <option value="" disabled>
                    Position wählen
                  </option>
                  {generatePositionOptions()}
                </select>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
