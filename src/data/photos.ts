/*
 * The Photos app's library, from Figma: Designs → "Photos" (6486:45662), in the order they're
 * laid out there (top row left to right, then the bottom row). The originals were resized to
 * 2400px at most and stripped of camera data (including any GPS location) on the way in.
 */
import p01 from "../assets/photos/01.jpg";
import p02 from "../assets/photos/02.jpg";
import p03 from "../assets/photos/03.jpg";
import p04 from "../assets/photos/04.jpg";
import p05 from "../assets/photos/05.jpg";
import p06 from "../assets/photos/06.jpg";
import p07 from "../assets/photos/07.jpg";
import p08 from "../assets/photos/08.jpg";
import p09 from "../assets/photos/09.jpg";
import p10 from "../assets/photos/10.jpg";
import p11 from "../assets/photos/11.jpg";
import p12 from "../assets/photos/12.jpg";

export interface Photo {
  image: ImageMetadata;
  /** Short file name for Finder */
  name: string;
  /** Describes the photo for screen readers, and titles it in the photo viewer */
  alt: string;
}

export const photos: Photo[] = [
  { image: p01, name: "Lion’s Head hike", alt: "Sitting at the top of the Lion’s Head hike, looking out over Signal Hill and the sea" },
  { image: p02, name: "Viral post", alt: "Selfie holding up a finger, with a post’s reactions showing 39,309 impressions" },
  { image: p03, name: "Snorkelling", alt: "Snorkelling in sparkling, sunlit ocean water" },
  { image: p04, name: "Golden retriever", alt: "A golden retriever smiling at the camera" },
  { image: p05, name: "Gym team", alt: "Group photo with the gym team on the training mats" },
  { image: p06, name: "Summit with the flag", alt: "A hiking group with the South African flag on a summit, Table Mountain behind" },
  { image: p07, name: "Camping trip", alt: "Two friends play-fighting beside an orange tent on a camping trip" },
  { image: p08, name: "2000 by Joey Bada$$", alt: "A music player showing Joey Bada$$’s album 2000" },
  { image: p09, name: "Mountain hike", alt: "Group selfie on a sunny mountain hike" },
  { image: p10, name: "Coastal sunset", alt: "Standing on the rocky coast at sunset" },
  { image: p11, name: "Guatemala flag", alt: "Holding the flag of Guatemala with a friend on a mountain above the sea" },
  { image: p12, name: "Cottage doorway", alt: "A golden retriever looking out of a stable door at a white cottage" },
];
