import { Prediction, Result } from "../supabase/types";

/**
 * Berechnet die Punktzahl für eine Vorhersage.
 *
 * Punktesystem:
 * - Exakte Position: 12 Punkte
 * - 1 Position daneben: 10 Punkte
 * - 2 Positionen daneben: 8 Punkte
 * - 3 Positionen daneben: 6 Punkte
 * - 4 Positionen daneben: 4 Punkte
 * - 5 Positionen daneben: 2 Punkte
 * - 6+ Positionen daneben: 0 Punkte
 */
export const calculateScore = (
  prediction: Pick<Prediction, "country_id" | "position">,
  results: Pick<Result, "country_id" | "position">[]
) => {
  // Finde das entsprechende Ergebnis
  const result = results.find((r) => r.country_id === prediction.country_id);

  // Wenn kein Ergebnis gefunden wurde, gib 0 Punkte
  if (!result) return 0;

  // Berechne den Abstand zwischen Vorhersage und Ergebnis
  const diff = Math.abs(prediction.position - result.position);

  // Vergebe Punkte basierend auf dem Abstand
  if (diff === 0) return 12;
  if (diff === 1) return 10;
  if (diff === 2) return 8;
  if (diff === 3) return 6;
  if (diff === 4) return 4;
  if (diff === 5) return 2;
  return 0;
};

/**
 * Berechnet die Gesamtpunktzahl für alle Vorhersagen eines Benutzers.
 */
export const calculateTotalScore = (
  predictions: Pick<Prediction, "country_id" | "position">[],
  results: Pick<Result, "country_id" | "position">[]
) => {
  return predictions.reduce((total, prediction) => {
    return total + calculateScore(prediction, results);
  }, 0);
};
