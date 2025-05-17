export type Tables = {
  users: {
    id: string;
    created_at: string;
    name: string;
    is_admin: boolean;
  };
  countries: {
    id: number;
    name: string;
    flag_code: string;
    artist: string;
    song: string;
  };
  predictions: {
    id: number;
    created_at: string;
    user_id: string;
    country_id: number;
    position: number;
  };
  results: {
    id: number;
    country_id: number;
    position: number;
  };
};

export type User = Tables["users"];
export type Country = Tables["countries"];
export type Prediction = Tables["predictions"];
export type Result = Tables["results"];
