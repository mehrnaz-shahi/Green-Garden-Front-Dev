import {
  MOCK_TOKEN,
  mockUser,
  mockRegularUser,
  mockPlantsWithGardens,
  mockGardens,
  defaultBookmarks,
} from "./mockData";

const STORAGE = {
  user: "gg_mock_user",
  bookmarks: "gg_mock_bookmarks",
  gardens: "gg_mock_gardens",
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getUser = () => readJson(STORAGE.user, mockUser);

const getBookmarks = () => readJson(STORAGE.bookmarks, defaultBookmarks);

const getGardens = () => readJson(STORAGE.gardens, mockGardens);

const hasToken = (token) => Boolean(token && token !== "undefined");

const ok = (data, status = 200) => ({ status, data });

const cleanPath = (path = "") =>
  String(path)
    .replace(/^\//, "")
    .split("?")[0]
    .replace(/\/$/, "");

const matchPlantId = (path) => {
  const match = path.match(/^plants\/(\d+)$/);
  return match ? Number(match[1]) : null;
};

const matchGardenId = (path) => {
  const match = path.match(/^gardens\/(\d+)$/);
  return match ? Number(match[1]) : null;
};

const matchBookmarkPlant = (path) => {
  const match = path.match(/^accounts\/bookmark-plant\/(\d+)$/);
  return match ? Number(match[1]) : null;
};

const matchAddScore = (path) => {
  const match = path.match(/^gardens\/(\d+)\/add_score$/);
  return match ? Number(match[1]) : null;
};

const filterPlants = (params = {}) => {
  return mockPlantsWithGardens.filter((plant) => {
    const checks = [
      ["light_intensity", plant.light_intensity],
      ["temperature", plant.temperature],
      ["type", plant.type],
      ["location_type", plant.location_type],
      ["water", plant.water],
      ["growth", plant.growth],
      ["attension_need", plant.attention_need],
      ["seasonal", plant.seasonal],
    ];

    for (const [key, value] of checks) {
      if (params[key] !== undefined && params[key] !== "" && Number(params[key]) !== Number(value)) {
        return false;
      }
    }

    const boolChecks = [
      ["pet_compatible", plant.pet_compatible],
      ["allergy_campatible", plant.alergy_compatible],
      ["edible", plant.edible],
      ["fragrance", plant.fragrance],
    ];

    for (const [key, value] of boolChecks) {
      if (params[key] === undefined || params[key] === "") continue;
      const wanted = params[key] === true || params[key] === "true";
      if (wanted !== Boolean(value)) return false;
    }

    return true;
  });
};

export const resolveMock = (method, path, { data, token, params } = {}) => {
  const route = cleanPath(path);
  const verb = method.toUpperCase();

  if (verb === "GET" && route === "plants/list") {
    return clone(mockPlantsWithGardens);
  }

  const plantId = matchPlantId(route);
  if (verb === "GET" && plantId) {
    const plant = mockPlantsWithGardens.find((item) => item.id === plantId);
    return clone(plant || mockPlantsWithGardens[0]);
  }

  if (verb === "GET" && route === "plants/filter") {
    const filtered = filterPlants(params);
    return clone(filtered.length ? filtered : mockPlantsWithGardens.slice(0, 3));
  }

  if (verb === "GET" && route === "accounts/get-user") {
    if (!hasToken(token)) return 401;
    return clone(getUser());
  }

  if (verb === "GET" && route === "gardens/get_garden") {
    if (!hasToken(token)) return 401;
    return clone(getGardens()[0]);
  }

  const gardenId = matchGardenId(route);
  if (verb === "GET" && gardenId) {
    const gardens = getGardens();
    const garden = gardens.find((item) => item.id === gardenId) || gardens[0];
    const currentUser = getUser();
    return clone({
      ...garden,
      is_owner: Boolean(currentUser.is_garden_owner && garden.id === gardens[0].id),
    });
  }

  if (verb === "GET" && route === "accounts/bookmark-list") {
    if (!hasToken(token)) return [];
    return clone(getBookmarks());
  }

  if (verb === "GET" && route === "token_check") {
    return ok({
      is_garden_owner: getUser().is_garden_owner,
      user_id: getUser().id,
    });
  }

  if (verb === "POST" && route === "accounts/login") {
    const owner = !String(data?.email || "").includes("user");
    const user = {
      ...(owner ? mockUser : { ...mockRegularUser, is_garden_owner: false }),
      email: data?.email || mockUser.email,
    };
    writeJson(STORAGE.user, user);
    return ok({ token: MOCK_TOKEN, user });
  }

  if (verb === "POST" && route === "accounts/signup") {
    const user = {
      ...mockUser,
      name: data?.name || mockUser.name,
      email: data?.email || mockUser.email,
      phone_number: data?.phone_number || mockUser.phone_number,
      is_garden_owner: Boolean(data?.is_garden_owner),
    };
    writeJson(STORAGE.user, user);
    return ok({ detail: "کد تایید ارسال شد" }, 201);
  }

  if (verb === "POST" && route === "accounts/verify") {
    return ok({ token: MOCK_TOKEN });
  }

  if (verb === "POST" && route === "accounts/change-password") {
    return ok({ detail: "رمز با موفقیت تغییر یافت." });
  }

  const addScoreGardenId = matchAddScore(route);
  if (verb === "POST" && addScoreGardenId) {
    const gardens = getGardens();
    const user = getUser();
    const next = gardens.map((garden) => {
      if (garden.id !== addScoreGardenId) return garden;
      return {
        ...garden,
        scores: [
          {
            id: Date.now(),
            score: data?.score || 5,
            comment: data?.comment || "",
            date: "۱۴۰۳/۰۶/۱۵",
            user: { name: user.name, image: user.image },
          },
          ...garden.scores,
        ],
      };
    });
    writeJson(STORAGE.gardens, next);
    return ok({ detail: "نظر ثبت شد" });
  }

  const bookmarkId = matchBookmarkPlant(route);
  if ((verb === "PUT" || verb === "POST") && bookmarkId) {
    const plant = mockPlantsWithGardens.find((item) => item.id === bookmarkId);
    if (plant) {
      const bookmarks = getBookmarks();
      if (!bookmarks.some((item) => item.id === plant.id)) {
        writeJson(STORAGE.bookmarks, [...bookmarks, plant]);
      }
    }
    return ok({ detail: "ذخیره شد" });
  }

  if (verb === "PUT" && route === "accounts/set-default-condition") {
    writeJson(STORAGE.user, { ...getUser(), ...data });
    return data;
  }

  if ((verb === "PUT" || verb === "PATCH") && route === "accounts/update-user") {
    const current = getUser();
    const next = { ...current, ...data, image: data?.image || current.image };
    writeJson(STORAGE.user, next);
    return ok(next);
  }

  if ((verb === "PUT" || verb === "PATCH") && route === "gardens/update") {
    const gardens = getGardens();
    const next = gardens.map((garden, index) =>
      index === 0 ? { ...garden, ...data } : garden
    );
    writeJson(STORAGE.gardens, next);
    return next[0];
  }

  if (verb === "DELETE" && route.startsWith("accounts/remove-saved-plant")) {
    const id = Number(route.split("/").pop());
    writeJson(
      STORAGE.bookmarks,
      getBookmarks().filter((item) => item.id !== id)
    );
    return ok({ detail: "حذف شد" });
  }

  if (verb === "GET") return [];
  return ok({});
};
