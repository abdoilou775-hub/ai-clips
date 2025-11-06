
export interface Clip {
  clip_start: number;
  clip_end: number;
  captions: {
    english: string;
    arabic: string;
  };
  title: string;
  hashtags: string[];
}
