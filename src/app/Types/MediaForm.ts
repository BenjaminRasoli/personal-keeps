export type MediaForm = {
  tmdbId: string;
  type: "movie" | "show";
  startDate: string;
  endDate: string;
  watchedAgain: { start: string; end: string }[];
  seasons: { seasonNumber: number; start: string; end: string }[];
};

export type MediaFormWithId = {
  id: string;
  tmdbId: string;
  type: "movie" | "show";
  startDate: string;
  endDate: string;
  watchedAgain: { start: string; end: string }[];
  seasons: { seasonNumber: number; start: string; end: string }[];
};

