export type CategoryId = "bags" | "shoes" | "jewelry" | "accessories" | "ready-to-wear";

export type ConditionId = "pristine" | "excellent" | "very-good" | "vintage";

export interface Category {
  id: CategoryId;
  he: string;
  en: string;
  descriptionHe: string;
  image: string;
}

export interface Condition {
  id: ConditionId;
  he: string;
  short: string;
  descriptionHe: string;
  /** 1–4 dots */
  grade: number;
}

export interface Designer {
  slug: string;
  name: string;
  originHe: string;
  founded: number;
  noteHe: string;
}

export interface Product {
  id: string;
  slug: string;
  designer: string; // designer slug
  nameHe: string;
  modelEn?: string;
  category: CategoryId;
  condition: ConditionId;
  price: number; // ILS
  estimatedRetail?: number; // ILS, for context only
  year: string;
  colorHe: string;
  materialHe: string;
  size?: string;
  measurementsHe?: string;
  includesHe: string[];
  conditionNotesHe: string;
  storyHe: string;
  images: string[];
  /** Days since it joined the boutique — drives "new arrivals" sort */
  addedDaysAgo: number;
  featured?: boolean;
}
