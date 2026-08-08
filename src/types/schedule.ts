export type Schedule = {
  id: string;
  obsidian_id: string;
  obsidian_path: string | null;

  type: string | null;
  category: string | null;
  label: string | null;

  title: string;

  game_id: string | null;
  scenario_id: string | null;

  games?: {
    genre: string | null;
    official_url: string | null;
  };

  scenarios?: {
    genre: string | null;
    official_url: string | null;
  };

  date: string;
  time: string | null;

  stream: boolean;
  stream_url: string | null;

  server: string | null;
  server_url: string | null;

  role: string | null;

  thumbnail_url: string | null;
  endcard_url: string | null;

  memo: string | null;

  created_at: string;
  updated_at: string;
};