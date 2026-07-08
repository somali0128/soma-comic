import { useEffect, useState } from 'react';
import type { MatchMode, OrderMenuState } from './types';

const STORAGE_KEY = 'order-menu-state';

const defaultState: OrderMenuState = {
  selectedIngredients: [],
  selectedTags: [],
  mode: 'strict',
};

function isValidMode(value: unknown): value is MatchMode {
  return value === 'strict' || value === 'relaxed';
}

function loadState(): OrderMenuState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw) as Partial<OrderMenuState>;
    return {
      selectedIngredients: Array.isArray(parsed.selectedIngredients)
        ? parsed.selectedIngredients.filter((id): id is string => typeof id === 'string')
        : [],
      selectedTags: Array.isArray(parsed.selectedTags)
        ? parsed.selectedTags.filter((tag): tag is string => typeof tag === 'string')
        : [],
      mode: isValidMode(parsed.mode) ? parsed.mode : 'strict',
    };
  } catch {
    return defaultState;
  }
}

export function useOrderMenuStorage() {
  const [state, setState] = useState<OrderMenuState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleIngredient = (id: string) => {
    setState((prev) => ({
      ...prev,
      selectedIngredients: prev.selectedIngredients.includes(id)
        ? prev.selectedIngredients.filter((item) => item !== id)
        : [...prev.selectedIngredients, id],
    }));
  };

  const toggleTag = (tag: string) => {
    setState((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((item) => item !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  const setMode = (mode: MatchMode) => {
    setState((prev) => ({ ...prev, mode }));
  };

  const clearFilters = () => {
    setState(defaultState);
  };

  return {
    ...state,
    toggleIngredient,
    toggleTag,
    setMode,
    clearFilters,
  };
}
