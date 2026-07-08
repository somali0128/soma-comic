export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  babyRating: number;
  tags: string[];
  requiredIngredients: string[];
}

export type MatchMode = 'strict' | 'relaxed';

export interface OrderMenuState {
  selectedIngredients: string[];
  selectedTags: string[];
  mode: MatchMode;
}

export interface RecipeMatch extends Recipe {
  missingIngredients: Ingredient[];
  matchScore: number;
}
