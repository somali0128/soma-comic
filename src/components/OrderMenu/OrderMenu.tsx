import { useMemo } from 'react';
import { ALL_TAGS, INGREDIENTS, RECIPES, ingredientMap } from './recipes';
import type { MatchMode, RecipeMatch } from './types';
import { useOrderMenuStorage } from './useOrderMenuStorage';

const MAX_MISSING_RELAXED = 2;

function getMissingIngredients(
  recipeRequired: string[],
  selected: string[]
): string[] {
  const selectedSet = new Set(selected);
  return recipeRequired.filter((id) => !selectedSet.has(id));
}

function filterRecipes(
  selectedIngredients: string[],
  selectedTags: string[],
  mode: MatchMode
): RecipeMatch[] {
  const hasIngredientFilter = selectedIngredients.length > 0;

  return RECIPES.filter((recipe) => {
    if (selectedTags.length > 0) {
      const hasAllTags = selectedTags.every((tag) => recipe.tags.includes(tag));
      if (!hasAllTags) return false;
    }

    if (!hasIngredientFilter) return true;

    const missing = getMissingIngredients(
      recipe.requiredIngredients,
      selectedIngredients
    );

    if (mode === 'strict') {
      return missing.length === 0;
    }

    return missing.length <= MAX_MISSING_RELAXED;
  }).map((recipe) => {
    const missingIds = hasIngredientFilter
      ? getMissingIngredients(recipe.requiredIngredients, selectedIngredients)
      : [];
    const missingIngredients = missingIds.map((id) => ingredientMap[id]).filter(Boolean);
    const ownedCount = recipe.requiredIngredients.length - missingIds.length;

    return {
      ...recipe,
      missingIngredients,
      matchScore: hasIngredientFilter ? ownedCount : recipe.requiredIngredients.length,
    };
  });
}

function sortRecipes(recipes: RecipeMatch[]): RecipeMatch[] {
  return [...recipes].sort((a, b) => {
    if (b.babyRating !== a.babyRating) {
      return b.babyRating - a.babyRating;
    }
    return b.matchScore - a.matchScore;
  });
}

function BabyRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" title={`宝宝评分 ${rating}/5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={`text-base leading-none ${
            index < rating ? 'text-amber-400' : 'text-orange-100'
          }`}
          aria-hidden
        >
          ★
        </span>
      ))}
      <span className="sr-only">宝宝评分 {rating} 分</span>
      <span className="ml-1 text-xs font-medium text-amber-700">{rating}.0</span>
    </div>
  );
}

function RecipeCard({
  recipe,
  showMissing,
}: {
  recipe: RecipeMatch;
  showMissing: boolean;
}) {
  return (
    <article className="group flex flex-col rounded-2xl border border-orange-100 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-stone-800">{recipe.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-stone-500">
            {recipe.description}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-lg" aria-hidden>
          🍽️
        </span>
      </div>

      <BabyRating rating={recipe.babyRating} />

      <div className="mt-3 flex flex-wrap gap-1.5">
        {recipe.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 border-t border-orange-50 pt-3">
        <p className="text-xs font-medium text-stone-400">所需食材</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {recipe.requiredIngredients.map((id) => {
            const ingredient = ingredientMap[id];
            if (!ingredient) return null;
            const isMissing = recipe.missingIngredients.some((m) => m.id === id);
            return (
              <span
                key={id}
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs ${
                  isMissing
                    ? 'bg-rose-50 text-rose-600 line-through decoration-rose-300'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                <span aria-hidden>{ingredient.emoji}</span>
                {ingredient.name}
              </span>
            );
          })}
        </div>
      </div>

      {showMissing && recipe.missingIngredients.length > 0 && (
        <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2">
          <p className="text-xs font-medium text-rose-600">
            还缺 {recipe.missingIngredients.length} 样食材
          </p>
          <p className="mt-0.5 text-sm text-rose-500">
            {recipe.missingIngredients.map((item) => `${item.emoji}${item.name}`).join('、')}
          </p>
        </div>
      )}
    </article>
  );
}

export default function OrderMenu() {
  const {
    selectedIngredients,
    selectedTags,
    mode,
    toggleIngredient,
    toggleTag,
    setMode,
    clearFilters,
  } = useOrderMenuStorage();

  const filteredRecipes = useMemo(
    () =>
      sortRecipes(
        filterRecipes(selectedIngredients, selectedTags, mode)
      ),
    [selectedIngredients, selectedTags, mode]
  );

  const hasActiveFilters =
    selectedIngredients.length > 0 || selectedTags.length > 0;

  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-6">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-700">
          <span aria-hidden>🧑‍🍳</span>
          今日吃什么
        </div>
        <h1 className="text-3xl font-bold text-stone-800 sm:text-4xl">
          家庭点菜小助手
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-stone-500">
          勾选家里有的食材，看看今天能做什么好吃的～
        </p>
      </header>

      <div className="space-y-6">
        {/* Mode toggle */}
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-stone-800">匹配模式</h2>
              <p className="mt-0.5 text-sm text-stone-500">
                {mode === 'strict'
                  ? '严格模式：必须食材全部拥有才显示'
                  : '宽松模式：最多缺少 2 样必须食材，并标注缺少项'}
              </p>
            </div>
            <div className="inline-flex rounded-xl bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setMode('strict')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  mode === 'strict'
                    ? 'bg-orange-400 text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                严格
              </button>
              <button
                type="button"
                onClick={() => setMode('relaxed')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  mode === 'relaxed'
                    ? 'bg-orange-400 text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                宽松
              </button>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="rounded-2xl border border-orange-100 bg-white/80 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-stone-800">
              <span aria-hidden>🥬</span>
              现有食材
              {selectedIngredients.length > 0 && (
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-normal text-orange-700">
                  已选 {selectedIngredients.length}
                </span>
              )}
            </h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-stone-400 transition hover:text-orange-500"
              >
                清空筛选
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {INGREDIENTS.map((ingredient) => {
              const isSelected = selectedIngredients.includes(ingredient.id);
              return (
                <button
                  key={ingredient.id}
                  type="button"
                  onClick={() => toggleIngredient(ingredient.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    isSelected
                      ? 'border-orange-300 bg-orange-100 text-orange-800 shadow-sm'
                      : 'border-stone-100 bg-stone-50 text-stone-600 hover:border-orange-200 hover:bg-orange-50'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="text-base" aria-hidden>
                    {ingredient.emoji}
                  </span>
                  {ingredient.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div className="rounded-2xl border border-orange-100 bg-white/80 p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-stone-800">
            <span aria-hidden>🏷️</span>
            标签筛选
          </h2>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    isSelected
                      ? 'bg-amber-400 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-800'
                  }`}
                  aria-pressed={isSelected}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-stone-800">
              <span aria-hidden>✨</span>
              推荐菜品
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-sm font-normal text-orange-700">
                {filteredRecipes.length} 道
              </span>
            </h2>
            <p className="text-sm text-stone-400">按宝宝评分从高到低排序</p>
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 px-6 py-16 text-center">
              <p className="text-4xl" aria-hidden>
                🍳
              </p>
              <p className="mt-3 font-medium text-stone-600">暂时没有匹配的菜品</p>
              <p className="mt-1 text-sm text-stone-400">
                试试切换宽松模式，或减少标签 / 多选几种食材
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  showMissing={mode === 'relaxed' && selectedIngredients.length > 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
