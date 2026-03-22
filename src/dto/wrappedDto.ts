export interface WrappedDTO {
  id: string; // UUID biasanya string
  tadarus_id: number;
  event_name: string;
  period_start: string;
  period_end: string;
  data_json: WrappedData;
  created_at: string;
}

export interface WrappedData {
  summary: {
    total_ayah: number;
    total_surah: number;
    total_users: number;
    total_sessions: number;
    total_days_active: number;
  };

  leaderboard: {
    top_reader: { name: string; total_ayah: number }[];
    most_sessions: { name: string; total_sessions: number }[];
    longest_session: { name: string; total_ayah: number }[];
  };

  best_day: {
    most_ayah: { date: string; total_ayah: number };
    most_sessions: { date: string; total_sessions: number };
  };

  streak: {
    longest_active: { days: number; start: string; end: string };
    longest_break: { days: number; start: string; end: string };
  };

  time_pattern: {
    favorite_hour: number;
    favorite_hour_count: number;
    top_hours?: { hour: number; total_sessions: number }[];
  };

  timeline: {
    date: string;
    total_ayah: number;
  }[];

  user_streaks: {
    name: string;
    longest_streak: number;
    start: string;
    end: string;
  }[];

  user_breaks: {
    name: string;
    longest_break: number;
    start: string;
    end: string;
  }[];

  personalities: {
    name: string;
    personality: string;
    description?: string;
  }[];

  slides: {
    type: string;
    data: any;
  }[];
}
