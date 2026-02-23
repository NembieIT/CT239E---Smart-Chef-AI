import { Recipe } from "../types";

export const MOCK_RECIPES: Recipe[] = [
    {
        id: "m1",
        name: "Salad Củ Dền Cam Tươi",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        calories: 180,
        cookingTime: 15,
        ingredients: ["2 củ dền", "1 quả cam", "Hành tây", "Dầu ô liu"],
        instructions: [
            "Luộc chín củ dền và cắt lát mỏng",
            "Gọt vỏ cam và tách lấy múi",
            "Trộn củ dền, cam và hành tây thái lát",
            "Rưới dầu ô liu và thưởng thức"
        ],
        nutrition: { protein: 2, carbs: 12, fat: 5 },
        servings: 2
    },
    {
        id: "m2",
        name: "Bò Sốt Vang Hành Tây",
        image: "https://images.unsplash.com/photo-1534939561126-755ecf1588b0",
        calories: 450,
        cookingTime: 60,
        ingredients: ["500g Thịt bò", "2 củ Hành tây", "3 quả Cà chua", "Gia vị sốt vang"],
        instructions: [
            "Thịt bò thái miếng vuông, ướp gia vị",
            "Xào hành tây và cà chua cho mềm",
            "Cho bò vào hầm cùng cà chua đến khi chín mềm",
            "Trình bày ra bát và dùng nóng với bánh mì"
        ],
        nutrition: { protein: 35, carbs: 10, fat: 20 },
        servings: 4
    },
    {
        id: "m3",
        name: "Súp Cà Chua Củ Dền",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd",
        calories: 220,
        cookingTime: 30,
        ingredients: ["3 quả Cà chua", "1 củ Củ dền", "Hành tây", "Tỏi"],
        instructions: [
            "Xào hành tỏi cho thơm",
            "Cho cà chua và củ dền cắt nhỏ vào nấu chín",
            "Dùng máy xay cầm tay xay nhuyễn hỗn hợp",
            "Đun sôi lại và nêm nếm gia vị vừa ăn"
        ],
        nutrition: { protein: 4, carbs: 18, fat: 2 },
        servings: 2
    }
];