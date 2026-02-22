import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSavedRecipesStore = create(
  persist(
    (set, get) => ({
      savedRecipes: [],
      addRecipe: (recipe) => {
        const exists = get().savedRecipes.some((item) => item.id === recipe.id)
        if (!exists) {
          set((state) => ({ savedRecipes: [recipe, ...state.savedRecipes] }))
        }
      },
      removeRecipe: (recipeId) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.filter((item) => item.id !== recipeId),
        }))
      },
      isSaved: (recipeId) => get().savedRecipes.some((item) => item.id === recipeId),
    }),
    {
      name: 'dapur-ai-saved-recipes',
    },
  ),
)
