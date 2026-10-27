/*
 * The YouTube Music window, from Figma: "YT Music Design" → "YT Music Desktop Version" (6485:43047).
 * One song plays, through YouTube's own embedded player (see MusicApp.astro); the rest of the
 * queue is there to look the part.
 */
import noNo from "../assets/ytm/thumbs/no-no.jpg";
import muchMoney from "../assets/ytm/thumbs/much-money.jpg";
import practice from "../assets/ytm/thumbs/practice.jpg";
import mandela from "../assets/ytm/thumbs/mandela.jpg";
import driveMeCrazy from "../assets/ytm/thumbs/drive-me-crazy.jpg";
import aColdSunday from "../assets/ytm/thumbs/a-cold-sunday.jpg";
import showMe from "../assets/ytm/thumbs/show-me.jpg";

export const nowPlaying = {
  title: "no, no",
  artist: "MIKE",
  views: "876K views",
  likes: "30k likes",
  playingFrom: "MIKE • Weight of the world",
  duration: "2:18",
  /**
   * The YouTube video that plays: the ID from its link, e.g. "dQw4w9WgXcQ" from
   * youtube.com/watch?v=dQw4w9WgXcQ. Its uploader must allow embedding.
   */
  youtubeId: "9bxODbJ-VqE", // MIKE, "No, No!"
};

export interface QueueItem {
  title: string;
  artist: string;
  duration: string;
  thumbnail: ImageMetadata;
}

/** "Up next" (the first entry is the song that plays) */
export const queue: QueueItem[] = [
  { title: nowPlaying.title, artist: nowPlaying.artist, duration: nowPlaying.duration, thumbnail: noNo },
  { title: "Much Money (feat. Freddie Gibbs)", artist: "Kenny Mason", duration: "3:08", thumbnail: muchMoney },
  { title: "Practice", artist: "Freddie Gibbs & Madlib", duration: "3:05", thumbnail: practice },
  { title: "MANDELA", artist: "Westside Gunn", duration: "4:37", thumbnail: mandela },
  { title: "drive ME crazy! (feat. Diana Gordon)", artist: "Lil Yachty", duration: "2:24", thumbnail: driveMeCrazy },
  { title: "A Cold Sunday", artist: "Lil Yachty", duration: "3:07", thumbnail: aColdSunday },
  { title: "Show Me", artist: "Joey Bada$$", duration: "2:31", thumbnail: showMe },
];

export const chips = ["All", "Familiar", "Discover", "Romance", "2010s", "Chill"];
export const tabs = ["Up next", "Lyrics", "Comments", "Related"];
