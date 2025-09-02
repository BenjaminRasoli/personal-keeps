import { Timestamp } from "firebase/firestore";

export type MediaItem = {
  id: string;
  title: string;
  image: string;
  tmdbId: string;
  type: "movie" | "show";
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  watchedAgain: { start: Timestamp | null; end: Timestamp | null }[];
  seasons: {
    seasonNumber: number;
    start: Timestamp | null;
    end: Timestamp | null;
  }[];
};
