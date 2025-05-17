"use client";

import React from "react";
import { User, Prediction, Result } from "@/lib/supabase/types";
import { calculateTotalScore } from "@/lib/utils/score";

type UserWithPredictions = {
  user: User;
  predictions: Prediction[];
};

type ScoreboardProps = {
  usersWithPredictions: UserWithPredictions[];
  results: Result[];
};

export const Scoreboard: React.FC<ScoreboardProps> = ({
  usersWithPredictions,
  results,
}) => {
  // Berechne die Punkte für jeden Benutzer
  const userScores = usersWithPredictions
    .map((userWithPredictions) => {
      const score = calculateTotalScore(
        userWithPredictions.predictions,
        results
      );

      return {
        user: userWithPredictions.user,
        score,
      };
    })
    .sort((a, b) => b.score - a.score); // Sortiere nach Punkten absteigend

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Rangliste</h2>

      {userScores.length === 0 && results.length === 0 ? (
        <p className="text-gray-500">Noch keine Ergebnisse verfügbar.</p>
      ) : userScores.length === 0 ? (
        <p className="text-gray-500">Noch keine Tipps abgegeben.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Platz
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Punkte
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userScores.map((userScore, index) => (
                <tr key={userScore.user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}.
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userScore.user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">
                    {userScore.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
