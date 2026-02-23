import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { RecipesPage } from "./pages/RecipesPage";
import { HistoryPage } from "./pages/HistoryPage";
import { AboutPage } from "./pages/AboutPage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "recipes", Component: RecipesPage },
      { path: "history", Component: HistoryPage },
      { path: "about", Component: AboutPage },
      { path: "recipe/:id", Component: RecipeDetailPage },
    ],
  },
]);
