import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { pantryIngredients } from '../utils/recipeData'

export default function IngredientPicker({ selectedIngredients, onChange }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return pantryIngredients
    }

    return pantryIngredients.filter((ingredient) => ingredient.includes(query.trim().toLowerCase()))
  }, [query])

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      onChange(selectedIngredients.filter((item) => item !== ingredient))
      return
    }
    onChange([...selectedIngredients, ingredient])
  }

  return (
    <section className="y2k-shell p-4">
      <h2 className="font-impact text-xl uppercase text-magenta">Pilih bahan dari peti ais</h2>
      <label className="mt-3 flex items-center gap-2 rounded-2xl border-2 border-black/10 bg-white/90 p-3">
        <Search size={16} className="text-iosBlue" />
        <input
          className="focus-ring w-full border-none bg-transparent font-ios text-sm outline-none"
          placeholder="Contoh: ayam, telur, santan"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        {filtered.map((ingredient) => {
          const active = selectedIngredients.includes(ingredient)
          return (
            <button
              key={ingredient}
              type="button"
              onClick={() => toggleIngredient(ingredient)}
              className={`rounded-2xl border-2 px-3 py-2 text-sm font-semibold transition ${
                active
                  ? 'border-magenta bg-magenta text-white'
                  : 'border-black/20 bg-white text-black hover:border-magenta'
              }`}
            >
              {ingredient}
            </button>
          )
        })}
      </div>
    </section>
  )
}
