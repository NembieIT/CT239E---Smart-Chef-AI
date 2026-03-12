import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootLayout } from "./layouts/RootLayout";
import { AuthPage } from "./pages/AuthPage";
import { HomePage } from "./pages/HomePage";
import { RecipesPage } from "./pages/RecipesPage";
import { HistoryPage } from "./pages/HistoryPage";
import { AboutPage } from "./pages/AboutPage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";
import { SearchRecipe } from "./pages/SearchRecipe";
import { ProfilePage } from "./pages/ProfilePage";
import { MealPlanPage } from "./pages/MealPlanPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        Component: ProtectedRoute,
        children: [
          { index: true, Component: HomePage },
          { path: "recipes", Component: RecipesPage },
          { path: "about", Component: AboutPage },
          { path: "recipe/:id", Component: RecipeDetailPage },
          { path: "search", Component: SearchRecipe },
          { path: "history", Component: HistoryPage },
          { path: "profile", Component: ProfilePage },
          { path: "meal-plan", Component: MealPlanPage },
        ],
      },
    ],
  },
  {
    path: "auth",
    Component: AuthPage
  },
]);
