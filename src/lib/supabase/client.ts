import { createClient } from "@supabase/supabase-js";
import { type Tables } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Tables>(supabaseUrl, supabaseAnonKey);

export const getUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
};

export const getUser = async (name: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("name", name)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
};

export const createUser = async (name: string) => {
  const { data, error } = await supabase
    .from("users")
    .insert({ name, is_admin: name === "Admin" })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCountries = async () => {
  const { data, error } = await supabase.from("countries").select("*");
  if (error) throw error;
  return data;
};

export const getUserPredictions = async (userId: string) => {
  const { data, error } = await supabase
    .from("predictions")
    .select("*, countries(*)")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

export const savePrediction = async (
  userId: string,
  countryId: number,
  position: number
) => {
  // Prüfen, ob bereits eine Vorhersage für diesen Benutzer und dieses Land existiert
  const { data: existingPrediction } = await supabase
    .from("predictions")
    .select("id")
    .eq("user_id", userId)
    .eq("country_id", countryId)
    .single();

  // Prüfen, ob bereits eine Position für diesen Benutzer vergeben wurde
  const { data: existingPosition } = await supabase
    .from("predictions")
    .select("id")
    .eq("user_id", userId)
    .eq("position", position)
    .single();

  // Wenn bereits eine Position vergeben wurde, diese löschen
  if (existingPosition) {
    await supabase.from("predictions").delete().eq("id", existingPosition.id);
  }

  // Wenn bereits eine Vorhersage existiert, diese aktualisieren
  if (existingPrediction) {
    const { error } = await supabase
      .from("predictions")
      .update({ position })
      .eq("id", existingPrediction.id);

    if (error) throw error;
    return;
  }

  // Ansonsten neue Vorhersage erstellen
  const { error } = await supabase
    .from("predictions")
    .insert({ user_id: userId, country_id: countryId, position });

  if (error) throw error;
};

export const getResults = async () => {
  const { data, error } = await supabase
    .from("results")
    .select("*, countries(*)");

  if (error) throw error;
  return data;
};

export const saveResult = async (countryId: number, position: number) => {
  // Prüfen, ob bereits ein Ergebnis für dieses Land existiert
  const { data: existingResult } = await supabase
    .from("results")
    .select("id")
    .eq("country_id", countryId)
    .single();

  // Prüfen, ob bereits eine Position vergeben wurde
  const { data: existingPosition } = await supabase
    .from("results")
    .select("id")
    .eq("position", position)
    .single();

  // Wenn bereits eine Position vergeben wurde, diese löschen
  if (existingPosition) {
    await supabase.from("results").delete().eq("id", existingPosition.id);
  }

  // Wenn bereits ein Ergebnis existiert, dieses aktualisieren
  if (existingResult) {
    const { error } = await supabase
      .from("results")
      .update({ position })
      .eq("id", existingResult.id);

    if (error) throw error;
    return;
  }

  // Ansonsten neues Ergebnis erstellen
  const { error } = await supabase
    .from("results")
    .insert({ country_id: countryId, position });

  if (error) throw error;
};
