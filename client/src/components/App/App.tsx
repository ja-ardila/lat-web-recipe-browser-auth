import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import type { Recipe } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { getRecipes, toggleLike } from "../../utils/api";
import AppLayout from "../AppLayout/AppLayout";
import {
  ProtectedRoute,
  PublicRoute,
} from "../ProtectedRoute/ProtectedRoute";
import HomePage from "../../pages/HomePage";
import FavoritesPage from "../../pages/FavoritesPage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import RecipePage from "../../pages/RecipePage";
import NotFoundPage from "../../pages/NotFoundPage";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    getRecipes()
      .then((data) => {
        setRecipes(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  async function handleToggleFavorite(id: string) {
    if (!currentUser) return;

    try {
      const updated = await toggleLike(id, currentUser._id);
      setRecipes((prev) =>
        prev.map((recipe) => (recipe.id === id ? updated : recipe)),
      );
    } catch (err) {
      console.error(err);
    }
  }

  /** Muestra la carga y los errores dentro de la ruta principal en lugar de retornar antes de tiempo, para que las demás rutas sigan siendo accesibles. */
  function homeContent() {
    if (isLoading) return <p className="app__loading">Cargando...</p>;
    if (error) return <p className="app__message">No se pudieron cargar las recetas.</p>;
    return (
      <HomePage
        recipes={recipes}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={homeContent()} />
          <Route
            path="/favorites"
            element={
              <FavoritesPage
                recipes={recipes}
                onToggleFavorite={handleToggleFavorite}
              />
            }
          />
          <Route
            path="/recipes/:id"
            element={<RecipePage recipes={recipes} />}
          />
        </Route>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
