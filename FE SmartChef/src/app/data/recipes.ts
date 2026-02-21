import { Recipe } from "../types";

export const recipes: Recipe[] = [
  {
    id: "1",
    name: "Salad Quinoa Địa Trung Hải",
    image:
      "https://images.unsplash.com/photo-1605034298551-baacf17591d1?q=80&w=1000",
    calories: 420,
    cookingTime: 25,
    ingredients: [
      "1 chén hạt quinoa",
      "2 chén nước dùng rau củ",
      "1 quả dưa chuột, thái hạt lựu",
      "2 quả cà chua, băm nhỏ",
      "1 quả ớt chuông, thái lát",
      "1/2 củ hành tây đỏ, thái mỏng",
      "Phô mai feta",
      "Dầu ô liu và nước cốt chanh",
    ],
    instructions: [
      "Rửa sạch quinoa dưới vòi nước lạnh và để ráo.",
      "Cho quinoa và nước dùng vào nồi, đun sôi rồi hạ nhỏ lửa trong 15 phút.",
      "Để quinoa nguội bớt rồi dùng nĩa xới tơi.",
      "Trộn đều quinoa với rau củ đã cắt nhỏ trong bát lớn.",
      "Rưới dầu ô liu, nước cốt chanh và rắc phô mai lên trên rồi thưởng thức.",
    ],
    nutrition: { protein: 15, carbs: 58, fat: 12 },
    servings: 4,
  },
  {
    id: "2",
    name: "Tôm Xào Hành Tây & Ớt Chuông",
    image:
      "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?q=80&w=1000",
    calories: 320,
    cookingTime: 15,
    ingredients: [
      "300g tôm tươi",
      "1 củ hành tây",
      "1 quả ớt chuông xanh",
      "Tỏi băm, hành lá",
      "Gia vị: Nước mắm, đường, tiêu",
    ],
    instructions: [
      "Làm sạch tôm, bóc vỏ và rút chỉ đen.",
      "Hành tây và ớt chuông cắt miếng vừa ăn.",
      "Phi thơm tỏi, cho tôm vào xào săn rồi để riêng ra đĩa.",
      "Xào hành tây và ớt chuông vừa chín tới thì cho tôm vào lại.",
      "Nêm nếm gia vị, rắc hành lá và tiêu rồi tắt bếp.",
    ],
    nutrition: { protein: 35, carbs: 12, fat: 8 },
    servings: 2,
  },
  {
    id: "3",
    name: "Mực Xào Cần Tỏi",
    image:
      "https://images.unsplash.com/photo-1533682805518-48d1f5b8cd3a?q=80&w=1000",
    calories: 280,
    cookingTime: 20,
    ingredients: [
      "500g mực ống tươi",
      "1 củ hành tây",
      "Cần tây, tỏi tây",
      "1 quả cà chua",
      "Gừng, tỏi, gia vị",
    ],
    instructions: [
      "Mực làm sạch, thái miếng vừa ăn, chần sơ với nước gừng để khử mùi.",
      "Cắt khúc cần tây, tỏi tây; hành tây bổ múi cau.",
      "Phi thơm tỏi, xào mực với lửa lớn cho săn lại rồi trút ra đĩa.",
      "Xào rau củ vừa chín tới, cho mực vào đảo nhanh tay.",
      "Nêm dầu hào, hạt nêm cho vừa miệng rồi bày ra đĩa.",
    ],
    nutrition: { protein: 42, carbs: 10, fat: 5 },
    servings: 3,
  },
  {
    id: "4",
    name: "Trứng Cuộn Hành Tây",
    image:
      "https://images.unsplash.com/photo-1510627489930-0c1b0ba0fa3e?q=80&w=1000",
    calories: 210,
    cookingTime: 10,
    ingredients: [
      "3 quả trứng gà",
      "1/2 củ hành tây băm nhỏ",
      "Hành lá, tiêu",
      "Nước mắm, hạt nêm",
    ],
    instructions: [
      "Đập trứng vào bát, cho hành tây băm, hành lá và gia vị vào đánh đều.",
      "Làm nóng chảo với một ít dầu ăn.",
      "Đổ một lớp trứng mỏng vào chảo, khi trứng vừa chín tới thì bắt đầu cuộn.",
      "Tiếp tục đổ lớp trứng tiếp theo và cuộn cho đến khi hết.",
      "Cắt miếng vừa ăn và dùng kèm với nước tương.",
    ],
    nutrition: { protein: 18, carbs: 5, fat: 14 },
    servings: 2,
  },
];

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.id === id);
}

export function getRecipesByIngredients(ingredients: string[]): Recipe[] {
  return recipes.filter((recipe) => {
    // Chuyển tất cả về viết thường để so sánh chính xác
    const recipeIngredients = recipe.ingredients.join(" ").toLowerCase();
    return ingredients.some((ingredient) =>
      recipeIngredients.includes(ingredient.toLowerCase()),
    );
  });
}
