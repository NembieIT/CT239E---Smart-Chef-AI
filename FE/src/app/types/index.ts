export interface DetectedFood {
  id: string;
  name: string;
  confidence: number;
  bbox?: { x: number; y: number; width: number; height: number };
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  calories: number;
  cookingTime: number;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
  };
  servings: number;
}

export interface ScanHistory {
  id: string;
  image: string;
  detectedFoods: DetectedFood[];
  timestamp: Date;
  suggestedRecipes: string[];
}
