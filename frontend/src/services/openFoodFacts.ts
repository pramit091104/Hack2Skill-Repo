import axios from 'axios';

export interface OpenFoodFactsProduct {
  code: string;
  product: {
    product_name?: string;
    product_name_en?: string;
    brands?: string;
    nutriments?: {
      'energy-kcal_100g'?: number;
      'energy-kcal_serving'?: number;
      'energy-kcal_value'?: number;
      proteins_100g?: number;
      proteins_serving?: number;
      proteins_value?: number;
      carbohydrates_100g?: number;
      carbohydrates_serving?: number;
      carbohydrates_value?: number;
      fat_100g?: number;
      fat_serving?: number;
      fat_value?: number;
    };
    serving_size?: string;
  };
  status: number;
  status_verbose: string;
}

export const openFoodFactsApi = {
  getProductByBarcode: async (barcode: string) => {
    try {
      const response = await axios.get<OpenFoodFactsProduct>(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      
      if (response.data.status !== 1 || !response.data.product) {
        throw new Error('Product not found or invalid barcode.');
      }

      const product = response.data.product;
      const nutriments = product.nutriments || {};

      // Fallback logic for nutritional values: try serving size first, then 100g, then direct value
      const calories = nutriments['energy-kcal_serving'] ?? nutriments['energy-kcal_100g'] ?? nutriments['energy-kcal_value'] ?? 0;
      const protein = nutriments.proteins_serving ?? nutriments.proteins_100g ?? nutriments.proteins_value ?? 0;
      const carbs = nutriments.carbohydrates_serving ?? nutriments.carbohydrates_100g ?? nutriments.carbohydrates_value ?? 0;
      const fat = nutriments.fat_serving ?? nutriments.fat_100g ?? nutriments.fat_value ?? 0;
      
      const name = product.product_name || product.product_name_en || 'Unknown Product';
      const brand = product.brands ? `${product.brands} ` : '';
      
      return {
        foodItems: [
          {
            name: `${brand}${name}`,
            quantity: product.serving_size || '1 serving',
            calories: Math.round(calories)
          }
        ],
        nutritionSummary: {
          calories: Math.round(calories),
          protein: Math.round(protein * 10) / 10,
          carbs: Math.round(carbs * 10) / 10,
          fat: Math.round(fat * 10) / 10
        }
      };
    } catch (error) {
      console.error('Error fetching product from OpenFoodFacts:', error);
      throw error;
    }
  }
};
