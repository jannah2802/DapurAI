import { Bookmark, Clock3, Sparkles, Trash2 } from 'lucide-react'

export default function RecipeCard({ recipe, isSaved, onSaveToggle }) {
  return (
    <article className="y2k-shell p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-impact text-xl uppercase text-magenta">{recipe.title}</h3>
          <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-iosBlue/10 px-2 py-1 text-xs font-semibold uppercase text-iosBlue">
            <Sparkles size={12} />
            {recipe.mealType}
          </p>
        </div>
        <button
          type="button"
          onClick={onSaveToggle}
          className={`rounded-xl border-2 p-2 ${
            isSaved ? 'border-iosRed bg-iosRed text-white' : 'border-iosGreen bg-iosGreen text-white'
          }`}
        >
          {isSaved ? <Trash2 size={16} /> : <Bookmark size={16} />}
        </button>
      </div>

      <p className="mt-3 inline-flex items-center gap-1 font-ios text-xs text-black/75">
        <Clock3 size={13} />
        {recipe.timeMinutes} min
      </p>

      <div className="mt-3">
        <p className="font-ios text-xs font-semibold uppercase tracking-wide text-black/70">Bahan wajib</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {recipe.ingredients.map((item) => (
            <span key={item} className="rounded-full border border-magenta/60 bg-white px-2 py-1 text-xs">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 space-y-1">
        {recipe.steps.map((step, index) => (
          <p key={`${recipe.id}-${step}`} className="star-bullet font-ios text-sm text-black">
            {index + 1}. {step}
          </p>
        ))}
      </div>
    </article>
  )
}
