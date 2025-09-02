export interface MediaForm {
  tmdbId: string;
  type: "movie" | "show";
  startDate: string;
  endDate: string;
  watchedAgain: { start: string; end: string }[];
  seasons: { seasonNumber: number; start: string; end: string }[];
}

