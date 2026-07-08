import type { Ingredient, Recipe } from './types';

export const INGREDIENTS: Ingredient[] = [
  { id: 'egg', name: '鸡蛋', emoji: '🥚' },
  { id: 'tomato', name: '番茄', emoji: '🍅' },
  { id: 'potato', name: '土豆', emoji: '🥔' },
  { id: 'chicken', name: '鸡胸肉', emoji: '🍗' },
  { id: 'tofu', name: '豆腐', emoji: '🧈' },
  { id: 'broccoli', name: '西兰花', emoji: '🥦' },
  { id: 'rice', name: '大米', emoji: '🍚' },
  { id: 'noodle', name: '面条', emoji: '🍜' },
  { id: 'spinach', name: '菠菜', emoji: '🥬' },
  { id: 'shrimp', name: '虾仁', emoji: '🦐' },
  { id: 'mushroom', name: '蘑菇', emoji: '🍄' },
  { id: 'carrot', name: '胡萝卜', emoji: '🥕' },
  { id: 'pork', name: '猪肉', emoji: '🥩' },
  { id: 'corn', name: '玉米', emoji: '🌽' },
  { id: 'avocado', name: '牛油果', emoji: '🥑' },
];

export const ALL_TAGS = [
  '减脂',
  '中餐',
  '早餐',
  '快手菜',
  '高蛋白',
  '晚餐',
  '汤',
  '素食',
  '宝宝友好',
] as const;

export const RECIPES: Recipe[] = [
  {
    id: 'tomato-egg',
    name: '番茄炒蛋',
    description: '经典家常味，十分钟上桌，宝宝也爱吃',
    babyRating: 5,
    tags: ['中餐', '快手菜', '早餐', '高蛋白', '宝宝友好'],
    requiredIngredients: ['egg', 'tomato'],
  },
  {
    id: 'potato-stew',
    name: '土豆炖肉',
    description: '软烂入味，配米饭绝配',
    babyRating: 4,
    tags: ['中餐', '晚餐', '高蛋白'],
    requiredIngredients: ['potato', 'pork', 'carrot'],
  },
  {
    id: 'broccoli-chicken',
    name: '西兰花炒鸡胸',
    description: '低脂高蛋白，减脂期首选',
    babyRating: 4,
    tags: ['减脂', '中餐', '晚餐', '高蛋白', '快手菜'],
    requiredIngredients: ['broccoli', 'chicken'],
  },
  {
    id: 'tofu-soup',
    name: '番茄豆腐汤',
    description: '暖胃又清淡，适合全家',
    babyRating: 5,
    tags: ['中餐', '汤', '素食', '减脂', '宝宝友好'],
    requiredIngredients: ['tofu', 'tomato', 'spinach'],
  },
  {
    id: 'shrimp-fried-rice',
    name: '虾仁蛋炒饭',
    description: '色彩丰富，一锅搞定',
    babyRating: 4,
    tags: ['中餐', '早餐', '快手菜', '高蛋白'],
    requiredIngredients: ['rice', 'egg', 'shrimp', 'carrot'],
  },
  {
    id: 'noodle-soup',
    name: '蘑菇鸡汤面',
    description: '汤面一体，温暖治愈',
    babyRating: 5,
    tags: ['中餐', '汤', '早餐', '宝宝友好'],
    requiredIngredients: ['noodle', 'chicken', 'mushroom', 'spinach'],
  },
  {
    id: 'avocado-salad',
    name: '牛油果鸡胸沙拉',
    description: '清爽不开火，夏日轻食',
    babyRating: 3,
    tags: ['减脂', '高蛋白', '快手菜', '素食'],
    requiredIngredients: ['avocado', 'chicken', 'corn', 'tomato'],
  },
  {
    id: 'spinach-egg',
    name: '菠菜蛋花汤',
    description: '五分钟搞定，补铁小能手',
    babyRating: 5,
    tags: ['汤', '早餐', '快手菜', '素食', '宝宝友好'],
    requiredIngredients: ['spinach', 'egg'],
  },
  {
    id: 'carrot-pork',
    name: '胡萝卜炒肉丝',
    description: '甜脆可口，下饭神器',
    babyRating: 4,
    tags: ['中餐', '晚餐', '快手菜'],
    requiredIngredients: ['carrot', 'pork'],
  },
  {
    id: 'tofu-broccoli',
    name: '豆腐烧西兰花',
    description: '植物蛋白满满，素食也能很香',
    babyRating: 3,
    tags: ['素食', '减脂', '中餐', '晚餐'],
    requiredIngredients: ['tofu', 'broccoli', 'mushroom'],
  },
  {
    id: 'corn-egg-pancake',
    name: '玉米鸡蛋饼',
    description: '香软好咬，早餐快手',
    babyRating: 5,
    tags: ['早餐', '快手菜', '宝宝友好', '高蛋白'],
    requiredIngredients: ['corn', 'egg', 'carrot'],
  },
  {
    id: 'shrimp-tofu',
    name: '虾仁烧豆腐',
    description: '鲜嫩滑口，营养双拼',
    babyRating: 4,
    tags: ['中餐', '晚餐', '高蛋白', '减脂'],
    requiredIngredients: ['shrimp', 'tofu', 'mushroom'],
  },
];

export const ingredientMap = Object.fromEntries(
  INGREDIENTS.map((item) => [item.id, item])
) as Record<string, Ingredient>;
