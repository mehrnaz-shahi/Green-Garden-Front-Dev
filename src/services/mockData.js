import garden1 from "../assets/images/garden/g1.jpg";
import garden2 from "../assets/images/garden/g2.avif";
import garden3 from "../assets/images/garden/g3.jfif";
import avatar from "../assets/images/avatar-profie.svg";
import userAvatar from "../assets/images/avatar-svgrepo-com.svg";

export const MOCK_TOKEN = "mock-green-garden-token";

export const mockUser = {
  id: 1,
  name: "مهرناز",
  email: "mehrnaz@example.com",
  phone_number: "09121234567",
  image: avatar,
  is_garden_owner: true,
  save: 2,
  attention_need: "1",
  have_allergy: "false",
  have_pet: "true",
  light_condition: "3",
  location_type_condition: "1",
};

export const mockRegularUser = {
  id: 2,
  name: "سارا محمدی",
  email: "sara@example.com",
  phone_number: "09129876543",
  image: userAvatar,
  is_garden_owner: false,
  save: 1,
};

const plantBase = {
  light_intensity: 2,
  water: 3,
  growth: 3,
  temperature: 1,
  pet_compatible: true,
  alergy_compatible: true,
  attention_need: 2,
  edible: false,
  fragrance: false,
  location_type: 1,
  seasonal: 1,
};

const plantMeta = {
  "aloe vear.jpg": { name: "آلوئه ورا", type: 1 },
  "shahpasand.jpg": { name: "شاه‌پسند", type: 2, fragrance: true },
  "fanj-J3-Pofva-_w-unsplash.jpg": { name: "فیکوس", type: 3 },
  "henry-co-FObU8l6PyLA-unsplash.jpg": { name: "کاکتوس زینتی", type: 1, water: 4 },
  "remi-muller-CZxraRv02-A-unsplash.jpg": { name: "حسن‌یوسف", type: 2 },
  "14.jpg": { name: "سانسوریا", type: 3, light_intensity: 1 },
  "Cast Iron Plant _ Best Low Light Indoor Plant for Home.jpeg": {
    name: "گیاه چدنی",
    type: 3,
    light_intensity: 1,
  },
  "lily ♡.jpeg": { name: "لیلیوم", type: 2, fragrance: true },
  "Juniper bonsai tree.jpeg": { name: "بونسای جونیپر", type: 3 },
  "Download premium png of PNG Monstera in a pot plant leaf vase by Ton about potted plant, pot plants, flower in vase, tropical plant, and tree tropic 13643546.jpeg":
    { name: "مونسترا", type: 3 },
  "vintage botanical illustration.jpeg": { name: "تصویر گیاهی کلاسیک", type: 2 },
  "my love for my plants🌼.jpeg": { name: "عشق گیاهان", type: 2 },
  "DIY Valentine's Day Gift Ideas.jpeg": { name: "هدیه گیاهی", type: 2 },
  "poppy flower-amico.svg": { name: "خشخاش", type: 2 },
  "poppy flower-amico (4) 1.svg": { name: "گل خشخاش", type: 2 },
  "default.jpg": { name: "گیاه آپارتمانی", type: 3 },
  "plantBg.jpg": { name: "برگ‌های گرمسیری", type: 3 },
  "plBg.png": { name: "برگ پهن", type: 3 },
  "6_2.png": { name: "گیاه گلدانی", type: 2 },
};

const titleFromFile = (file) =>
  file
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim()
    .slice(0, 42);

const plantImageContext = require.context(
  "../assets/images/plants",
  false,
  /\.(jpe?g|png|svg|webp|avif|jfif)$/i
);

const plantImageEntries = plantImageContext.keys().map((key) => ({
  file: key.replace("./", ""),
  src: plantImageContext(key),
}));

export const mockPlants = plantImageEntries.map((entry, index) => {
  const meta = plantMeta[entry.file] || {};
  const name = meta.name || titleFromFile(entry.file);
  const neighbors = [
    entry.src,
    plantImageEntries[(index + 1) % plantImageEntries.length].src,
    plantImageEntries[(index + 2) % plantImageEntries.length].src,
  ];

  return {
    ...plantBase,
    ...meta,
    id: index + 1,
    name,
    type: meta.type || (index % 3) + 1,
    main_img: entry.src,
    images: neighbors,
    description: `گیاه ${name} از مجموعه گرین گاردن؛ مناسب نگهداری در خانه.`,
    seasonal: 1,
  };
});

const gardenScores = (gardenId) => [
  {
    id: gardenId * 10 + 1,
    score: 5,
    comment: "گیاه‌ها سالم و بسته‌بندی مرتب بود. حتماً دوباره سفارش می‌دهم.",
    date: "۱۴۰۳/۰۲/۱۸",
    user: { name: "علی رضایی", image: userAvatar },
  },
  {
    id: gardenId * 10 + 2,
    score: 4,
    comment: "مشاوره خوبی دادند و گیاه مناسب فضای آپارتمان معرفی کردند.",
    date: "۱۴۰۳/۰۱/۰۹",
    user: { name: "نگار احمدی", image: avatar },
  },
];

const plantSummary = (plant) => ({
  id: plant.id,
  name: plant.name,
  type: plant.type,
  main_img: plant.main_img,
});

export const mockGardens = [
  {
    id: 8,
    name: "گلخانه ارکیده",
    address: "تهران، خیابان ولیعصر، پلاک ۲۱۰",
    avg_score: 4,
    business_code: "1234567890",
    is_owner: true,
    profile_photo: garden1,
    user_name: "مهرناز",
    phone_number: "021-88776655",
    plants: mockPlants.slice(0, 6).map(plantSummary),
    scores: gardenScores(8),
  },
  {
    id: 9,
    name: "گلخانه سپید",
    address: "اصفهان، خیابان چهارباغ",
    avg_score: 5,
    business_code: "9876543210",
    is_owner: false,
    profile_photo: garden2,
    user_name: "حسین کاظمی",
    phone_number: "031-33445566",
    plants: mockPlants.slice(4, 10).map(plantSummary),
    scores: gardenScores(9),
  },
  {
    id: 10,
    name: "گلخانه بهار",
    address: "شیراز، بلوار زند",
    avg_score: 3,
    business_code: "5647382910",
    is_owner: false,
    profile_photo: garden3,
    user_name: "مریم نوری",
    phone_number: "071-32221100",
    plants: mockPlants.slice(8, 14).map(plantSummary),
    scores: gardenScores(10),
  },
];

const attachGardens = (plant) => ({
  ...plant,
  gardens: mockGardens.map((garden) => ({
    id: garden.id,
    name: garden.name,
    profile_photo: garden.profile_photo,
    avg_score: garden.avg_score,
  })),
});

export const mockPlantsWithGardens = mockPlants.map(attachGardens);

export const defaultBookmarks = mockPlants.slice(0, 3);
