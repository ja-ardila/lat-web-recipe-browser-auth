import { useNavigate } from 'react-router';

import type { Recipe } from '../../types';
import { categoryColors, categoryLabels } from '../../data/recipes';
import { useAuth } from '../../contexts/AuthContext';
import './RecipeCard.css';

type Props = {
  recipe: Recipe;
  onToggleFavorite: (id: string) => void;
};

function RecipeCard({ recipe, onToggleFavorite }: Props) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isFavorited = currentUser
    ? recipe.likes.includes(currentUser._id)
    : false;

  return (
    <article className="recipe-card">
      <button
        type="button"
        className="recipe-card__view"
        onClick={() => navigate(`/recipes/${recipe.id}`)}
        aria-label="Ver detalles de la receta"
      ></button>
      <button
        type="button"
        className="recipe-card__favorite"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(recipe.id);
        }}
        aria-label={isFavorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        {isFavorited ? '♥' : '♡'}
      </button>
      <span
        style={{
          backgroundColor: categoryColors[recipe.category],
        }}
        className="recipe-card__category"
      >
        {categoryLabels[recipe.category]}
      </span>
      <h2 className="recipe-card__title">{recipe.title}</h2>
      <p className="recipe-card__description">{recipe.description}</p>
    </article>
  );
}

export default RecipeCard;
