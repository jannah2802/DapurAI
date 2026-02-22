import { recipeCatalog } from './recipeData'

function scoreRecipe(recipe, selectedIngredients, mealType) {
  const selectedSet = new Set(selectedIngredients)
  const requiredMatches = recipe.ingredients.filter((ingredient) => selectedSet.has(ingredient)).length
  const optionalMatches = recipe.optional.filter((ingredient) => selectedSet.has(ingredient)).length
  const coverage = requiredMatches / recipe.ingredients.length
  const mealBonus = mealType === 'all' || recipe.mealType === mealType ? 0.15 : 0

  return coverage + optionalMatches * 0.04 + mealBonus
}

export function recommendRecipes(selectedIngredients, mealType = 'all', limit = 5) {
  if (!selectedIngredients?.length) {
    return []
  }

  return recipeCatalog
    .map((recipe) => ({
      ...recipe,
      score: scoreRecipe(recipe, selectedIngredients, mealType),
    }))
    .filter((recipe) => recipe.score >= 0.35)
    .sort((a, b) => b.score - a.score || a.timeMinutes - b.timeMinutes)
    .slice(0, limit)
}
