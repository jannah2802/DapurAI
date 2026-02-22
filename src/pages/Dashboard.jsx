import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChefHat, LogOut, WifiOff } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useSavedRecipesStore } from '../hooks/useSavedRecipesStore'
import { recommendRecipes } from '../utils/recommendRecipes'
import IngredientPicker from '../components/IngredientPicker'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import RecipeCard from '../components/RecipeCard'

const mealTypes = [
  { value: 'all', label: 'Semua' },
  { value: 'quick', label: 'Cepat' },
  { value: 'comfort', label: 'Comfort' },
  { value: 'healthy', label: 'Sihat' },
]

export default function Dashboard({ auth }) {
  const { user, isGuest, logout } = auth
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [mealType, setMealType] = useState('all')
  const [tab, setTab] = useState('suggested')

  const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile(isGuest ? null : user?.id)
  const { savedRecipes, addRecipe, removeRecipe, isSaved } = useSavedRecipesStore()

  const recommendationsQuery = useQuery({
    queryKey: ['recommendations', selectedIngredients, mealType],
    queryFn: () => Promise.resolve(recommendRecipes(selectedIngredients, mealType, 8)),
    enabled: selectedIngredients.length > 0,
  })

  const displayedRecipes = useMemo(() => {
    if (tab === 'saved') {
      return savedRecipes
    }

    return recommendationsQuery.data ?? []
  }, [recommendationsQuery.data, savedRecipes, tab])

  const handleToggleSave = (recipe) => {
    if (isSaved(recipe.id)) {
      removeRecipe(recipe.id)
      return
    }
    addRecipe(recipe)
  }

  if (!isGuest && profileLoading) {
    return <LoadingSpinner label="Memuatkan profil..." />
  }

  if (!isGuest && profileError) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 py-6">
        <EmptyState
          title="Profil tak jumpa"
          description="Pastikan SQL schema & trigger Supabase telah dijalankan."
        />
      </main>
    )
  }

  const displayName = isGuest ? 'Guest Chef' : profile?.display_name || profile?.username || 'Chef'

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-5">
      <header className="y2k-shell p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="font-impact text-3xl uppercase text-magenta">Dapur AI</h1>
            <p className="mt-1 font-ios text-sm text-black/80">Hai {displayName} - jom pilih bahan.</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl border-2 border-iosRed bg-iosRed px-3 py-2 text-white"
          >
            <LogOut size={15} />
          </button>
        </div>

        <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-iosOrange/15 px-3 py-1 font-ios text-xs text-iosOrange">
          <WifiOff size={13} />
          Offline mode: cadangan resipi berjalan tanpa internet
        </p>
      </header>

      <section className="mt-4 space-y-4">
        <IngredientPicker selectedIngredients={selectedIngredients} onChange={setSelectedIngredients} />

        <div className="y2k-shell p-4">
          <p className="font-impact text-lg uppercase text-magenta">Mode masakan</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {mealTypes.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setMealType(item.value)}
                className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold ${
                  mealType === item.value
                    ? 'border-iosBlue bg-iosBlue text-white'
                    : 'border-black/20 bg-white text-black'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab('suggested')}
            className={`flex-1 rounded-2xl border-2 px-3 py-3 font-ios text-sm font-semibold ${
              tab === 'suggested' ? 'border-magenta bg-magenta text-white' : 'border-black/20 bg-white text-black'
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <ChefHat size={15} /> Cadangan
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab('saved')}
            className={`flex-1 rounded-2xl border-2 px-3 py-3 font-ios text-sm font-semibold ${
              tab === 'saved' ? 'border-magenta bg-magenta text-white' : 'border-black/20 bg-white text-black'
            }`}
          >
            Simpanan ({savedRecipes.length})
          </button>
        </div>
      </section>

      <section className="mt-4 space-y-3 pb-8">
        {tab === 'suggested' && selectedIngredients.length === 0 ? (
          <EmptyState
            title="Belum pilih bahan"
            description="Pilih sekurang-kurangnya 1 bahan untuk dapatkan cadangan resipi automatik."
          />
        ) : null}

        {recommendationsQuery.isFetching && tab === 'suggested' ? (
          <LoadingSpinner label="Menjana cadangan resipi..." />
        ) : null}

        {!recommendationsQuery.isFetching && displayedRecipes.length === 0 && (tab === 'saved' || selectedIngredients.length > 0) ? (
          <EmptyState
            title={tab === 'saved' ? 'Belum ada simpanan' : 'Tiada padanan sesuai'}
            description={
              tab === 'saved'
                ? 'Simpan mana-mana resipi supaya mudah rujuk semula.'
                : 'Tambah lagi bahan atau tukar mode masakan untuk lebih padanan.'
            }
          />
        ) : null}

        {displayedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isSaved={isSaved(recipe.id)}
            onSaveToggle={() => handleToggleSave(recipe)}
          />
        ))}
      </section>
    </main>
  )
}
