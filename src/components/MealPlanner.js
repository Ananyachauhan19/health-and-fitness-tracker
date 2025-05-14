import React, { useState } from 'react';

const mealTemplates = {
  weightLoss: {
    name: 'Weight Loss Meal Plan',
    meals: {
      breakfast: ['Oatmeal with berries', 'Greek yogurt with honey', 'Whole grain toast'],
      lunch: ['Grilled chicken salad', 'Quinoa bowl', 'Vegetable soup'],
      dinner: ['Baked salmon', 'Steamed vegetables', 'Brown rice'],
      snacks: ['Apple with almonds', 'Carrot sticks', 'Protein shake']
    },
    calories: '1500-1800'
  },
  maintenance: {
    name: 'Maintenance Meal Plan',
    meals: {
      breakfast: ['Eggs and toast', 'Smoothie bowl', 'Breakfast burrito'],
      lunch: ['Turkey sandwich', 'Tuna pasta', 'Chicken wrap'],
      dinner: ['Stir-fry with tofu', 'Grilled steak', 'Fish tacos'],
      snacks: ['Mixed nuts', 'Protein bar', 'Fruit']
    },
    calories: '2000-2500'
  },
  muscleGain: {
    name: 'Muscle Gain Meal Plan',
    meals: {
      breakfast: ['Protein pancakes', 'Egg white omelette', 'Overnight oats'],
      lunch: ['Chicken rice bowl', 'Beef stir-fry', 'Protein pasta'],
      dinner: ['Salmon with quinoa', 'Chicken breast', 'Lean beef'],
      snacks: ['Protein shake', 'Peanut butter sandwich', 'Trail mix']
    },
    calories: '2500-3000'
  }
};

export default function MealPlanner() {
  const [selectedPlan, setSelectedPlan] = useState('maintenance');
  const [customMeals, setCustomMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });

  const addCustomMeal = (mealType) => {
    setCustomMeals({
      ...customMeals,
      [mealType]: [...customMeals[mealType], { name: '', calories: 0 }]
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex space-x-4">
        {Object.keys(mealTemplates).map((plan) => (
          <button
            key={plan}
            onClick={() => setSelectedPlan(plan)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedPlan === plan
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {plan.split(/(?=[A-Z])/).join(' ')}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{mealTemplates[selectedPlan].name}</h2>
          <span className="text-green-600 font-semibold">
            {mealTemplates[selectedPlan].calories} calories/day
          </span>
        </div>

        {Object.entries(mealTemplates[selectedPlan].meals).map(([type, meals]) => (
          <div key={type} className="mb-6">
            <h3 className="text-lg font-semibold capitalize mb-3">{type}</h3>
            <ul className="space-y-2">
              {meals.map((meal, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-sm">
                    {index + 1}
                  </span>
                  <span>{meal}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Custom Meal Plan</h2>
        {Object.entries(customMeals).map(([type, meals]) => (
          <div key={type} className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold capitalize">{type}</h3>
              <button
                onClick={() => addCustomMeal(type)}
                className="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add {type}
              </button>
            </div>
            <div className="space-y-3">
              {meals.map((meal, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={meal.name}
                    onChange={(e) => {
                      const newMeals = [...customMeals[type]];
                      newMeals[index].name = e.target.value;
                      setCustomMeals({ ...customMeals, [type]: newMeals });
                    }}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Meal name"
                  />
                  <input
                    type="number"
                    value={meal.calories}
                    onChange={(e) => {
                      const newMeals = [...customMeals[type]];
                      newMeals[index].calories = parseInt(e.target.value);
                      setCustomMeals({ ...customMeals, [type]: newMeals });
                    }}
                    className="w-24 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Calories"
                  />
                  <button
                    onClick={() => {
                      const newMeals = customMeals[type].filter((_, i) => i !== index);
                      setCustomMeals({ ...customMeals, [type]: newMeals });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}