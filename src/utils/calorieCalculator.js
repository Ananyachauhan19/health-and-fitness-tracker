// Calorie database (calories per serving)
const foodDatabase = {
  // Breakfast items
  'oatmeal': 307,
  'eggs': 155,
  'toast': 75,
  'bread': 265,
  'milk': 103,
  'cereal': 307,
  'banana': 105,
  'apple': 95,
  'orange juice': 111,
  'coffee': 2,

  // Lunch/Dinner items
  'rice': 206,
  'chicken': 335,
  'fish': 206,
  'beef': 213,
  'pasta': 371,
  'potato': 161,
  'vegetables': 59,
  'salad': 20,
  'soup': 168,
  'sandwich': 350,

  // Common snacks
  'nuts': 607,
  'yogurt': 59,
  'chips': 536,
  'chocolate': 546,
  'fruit': 60,
  'granola bar': 190,
  'cookies': 502,
  'ice cream': 273
};

export const calculateMealCalories = (foodText) => {
  if (!foodText) return 0;
  
  let totalCalories = 0;
  const foodItems = foodText.toLowerCase().split(',').map(item => item.trim());
  
  foodItems.forEach(item => {
    for (const [dbFood, calories] of Object.entries(foodDatabase)) {
      if (item.includes(dbFood)) {
        totalCalories += calories;
        break;
      }
    }
  });
  
  return totalCalories;
};

export const calculateDailyCalories = (meals) => {
  const { breakfast, lunch, dinner, snacks } = meals;
  
  return {
    breakfast: calculateMealCalories(breakfast),
    lunch: calculateMealCalories(lunch),
    dinner: calculateMealCalories(dinner),
    snacks: calculateMealCalories(snacks),
    total: calculateMealCalories(breakfast) + 
           calculateMealCalories(lunch) + 
           calculateMealCalories(dinner) + 
           calculateMealCalories(snacks)
  };
};

export const getCalorieRecommendations = (profile, dailyCalories) => {
  const recommendations = [];
  
  // Base recommended calories by gender
  const baseRecommended = profile.gender?.toLowerCase() === 'female' ? 2000 : 2500;
  
  // Adjust based on activity level
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'very active': 1.725,
    'extra active': 1.9
  };
  
  const activityLevel = profile.exerciseLevel?.toLowerCase() || 'moderate';
  const recommendedCalories = Math.round(baseRecommended * activityMultipliers[activityLevel]);
  
  // Generate recommendations
  if (dailyCalories.total < recommendedCalories * 0.8) {
    recommendations.push(`You're eating ${recommendedCalories - dailyCalories.total} calories below your recommended intake of ${recommendedCalories} calories.`);
    recommendations.push("Consider increasing your food intake to maintain healthy energy levels.");
  } else if (dailyCalories.total > recommendedCalories * 1.2) {
    recommendations.push(`You're eating ${dailyCalories.total - recommendedCalories} calories above your recommended intake of ${recommendedCalories} calories.`);
    recommendations.push("Consider reducing portion sizes or choosing lower-calorie alternatives.");
  }
  
  // Meal distribution recommendations
  if (dailyCalories.breakfast < dailyCalories.total * 0.2) {
    recommendations.push("Try to have a bigger breakfast - aim for 20-25% of your daily calories.");
  }
  if (dailyCalories.dinner > dailyCalories.total * 0.4) {
    recommendations.push("Your dinner is relatively heavy - try to keep it to 30-35% of your daily calories.");
  }
  
  return recommendations;
};