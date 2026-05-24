export interface Comment {
  id: string;
  userName: string;
  userAvatar?: string;
  text: string;
  rating: number;
  timestamp: string;
}

export interface SkillCardType {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  avgLearningTime: string;
  vacancyPercentage: number;
  isAiGenerated: boolean;
  description: string;
  roadmapSteps: string[];
  whereToLearn: { platform: string; path: string; hasCertificate: boolean }[];
  vacanciesList: string[];
  comments: Comment[];
  rating: number; // average rating
}

export interface UserProfile {
  uid: string;
  name: string;
  username: string;
  bio: string;
  contact: string;
  hideContactPublic: boolean;
  followers: string[]; // uid list
  following: string[]; // uid list
  profileImage: string;
}
