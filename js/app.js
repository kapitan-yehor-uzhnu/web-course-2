// Тимчасова перевірка підключення — прибрати наприкінці роботи
console.log("app.js підключено");

/* ===== Дані ===== */

// Фільми кінотеатру «Кіносвіт» (спрощено з variants-data/variant04.json).
// const забороняє лише перезаписати саму змінну films іншим значенням,
// а вміст масиву лишається змінним — тому films.push(...) працює.
const films = [
  {
    id: 1,
    title: "Початок",
    director: "Крістофер Нолан",
    year: 2010,
    durationMin: 148,
    genre: "фантастика",
    boxOffice: { budgetMillion: 160, grossMillion: 839 },
    ratings: [9, 8.5, 10, 9, 8]
  },
  {
    id: 2,
    title: "Темний лицар",
    director: "Крістофер Нолан",
    year: 2008,
    durationMin: 152,
    genre: "бойовик",
    boxOffice: { budgetMillion: 185, grossMillion: 1006 },
    ratings: [10, 9.5, 9, 10]
  },
  {
    id: 3,
    title: "Титанік",
    director: "Джеймс Кемерон",
    year: 1997,
    durationMin: 194,
    genre: "мелодрама",
    boxOffice: { budgetMillion: 200, grossMillion: 2264.7 },
    ratings: [8, 9, 7.5]
  },
  {
    id: 4,
    title: "Матриця",
    director: "Лана і Ліллі Вачовскі",
    year: 1999,
    durationMin: 136,
    genre: "фантастика",
    boxOffice: { budgetMillion: 63, grossMillion: 467.2 },
    ratings: [9, 9, 8.5, 10, 9]
  },
  {
    id: 5,
    title: "Дюна",
    director: "Дені Вільнев",
    year: 2021,
    durationMin: 155,
    genre: "пригоди",
    boxOffice: { budgetMillion: 165, grossMillion: 407.6 },
    ratings: [9, 8, 8.5]
  },
  {
    id: 6,
    title: "Гравітація",
    director: "Альфонсо Куарон",
    year: 2013,
    durationMin: 91,
    genre: "трилер",
    boxOffice: { budgetMillion: 100, grossMillion: 723.2 },
    ratings: [8, 7.5]
  }
];

/* ===== Допоміжні функції ===== */

// Записує текст у вказаний елемент. Масив рядків склеює переносами.
const show = (id, value) => {
  const box = document.getElementById(id);
  if (box === null) {
    console.error("Немає елемента з id:", id);
    return;
  }
  box.textContent = Array.isArray(value) ? value.join("\n") : value;
};

// Приймає масив фільмів — повертає рядок-список назв або «нічого не знайдено»
const titlesOrEmpty = (items) =>
  items.length > 0
    ? items.map((film) => `  • ${film.title}`).join("\n")
    : "  нічого не знайдено";

/* ===== Функції обробки ===== */

// Приймає фільм — повертає назву узагальненої групи за його жанром
function categoryOf(film) {
  switch (film.genre) {
    case "фантастика":
    case "пригоди":
      return "Фантастика й пригоди";
    case "бойовик":
    case "трилер":
      return "Гостросюжетне кіно";
    case "драма":
      return "Драма";
    default:
      return "Інші жанри";
  }
}

// Приймає масив фільмів — повертає масив рядків «1. Назва — режисер, рік (збори)»
const numberedList = (items) => {
  const lines = [];
  for (let i = 0; i < items.length; i++) {
    const film = items[i];
    lines.push(
      `${i + 1}. ${film.title} — ${film.director}, ${film.year} (збори ${film.boxOffice.grossMillion} млн $)`
    );
  }
  return lines;
};

// Приймає масив фільмів і жанр — повертає фільми саме цього жанру
const filterByGenre = (items, value) => items.filter((film) => film.genre === value);

// Приймає масив фільмів і кількість хвилин — повертає фільми, довші за цю тривалість
const filterByDurationOver = (items, minutes) =>
  items.filter((film) => film.durationMin > minutes);

// Приймає масив фільмів — повертає НОВИЙ масив, відсортований за роком випуску
const sortByYear = (items) => [...items].sort((a, b) => a.year - b.year);

// Приймає масив фільмів — повертає НОВИЙ масив, відсортований за назвою (українська абетка)
const sortByTitle = (items) => [...items].sort((a, b) => a.title.localeCompare(b.title, "uk"));

// Приймає фільм — повертає прибуток у мільйонах доларів (збори мінус бюджет)
const profitOf = (film) => film.boxOffice.grossMillion - film.boxOffice.budgetMillion;

// Приймає фільм — повертає середню оцінку глядачів цього фільму
const averageRatingOf = (film) =>
  film.ratings.reduce((sum, rating) => sum + rating, 0) / film.ratings.length;

// Приймає масив фільмів — повертає об'єкт зі статистикою за тривалістю, жанрами й оцінками
const statsForFilms = (items) => {
  // Початкове значення 0 — це стартова сума. Без нього reduce узяв би накопичувачем
  // перший фільм (об'єкт), і «об'єкт + число» дало б рядок "[object Object]148…",
  // а на порожньому масиві reduce без початкового значення взагалі кидає помилку.
  const total = items.reduce((sum, film) => sum + film.durationMin, 0);
  // Найдовший фільм: накопичувач — поточний «рекордсмен», порівнюємо з кожним фільмом
  const max = items.reduce((longest, film) =>
    film.durationMin > longest.durationMin ? film : longest
  );
  const ratingSum = items.reduce((sum, film) => sum + averageRatingOf(film), 0);
  return {
    count: items.length,
    total,
    average: (total / items.length).toFixed(1),
    max,
    categories: new Set(items.map((film) => film.genre)).size,
    averageRating: (ratingSum / items.length).toFixed(2)
  };
};

/* ===== Виведення результатів ===== */

show("out-count", `Фільмів у каталозі: ${films.length}`);
show("out-numbered", numberedList(films));

show("out-categories", films.map((film) => `${film.title} → ${categoryOf(film)}`));

const sciFi = filterByGenre(films, "фантастика");
const musicals = filterByGenre(films, "мюзикл");
const longFilms = filterByDurationOver(films, 150);

show("out-filter", [
  `Жанр «фантастика»: знайдено ${sciFi.length}`,
  titlesOrEmpty(sciFi),
  `Жанр «мюзикл»: знайдено ${musicals.length}`,
  titlesOrEmpty(musicals),
  `Довші за 150 хв: знайдено ${longFilms.length}`,
  titlesOrEmpty(longFilms)
]);

const byYear = sortByYear(films);
const byTitle = sortByTitle(films);

show("out-sorted", [
  "За роком випуску:",
  byYear.map((film) => `  • ${film.year} — ${film.title}`).join("\n"),
  "За назвою:",
  byTitle.map((film) => `  • ${film.title}`).join("\n"),
  "Вихідний масив (порядок не змінився):",
  films.map((film) => `  • ${film.id}. ${film.title}`).join("\n")
]);

const stats = statsForFilms(films);

show("out-stats", [
  `Фільмів: ${stats.count}`,
  `Загальна тривалість: ${stats.total} хв`,
  `Середня тривалість: ${stats.average} хв`,
  `Найдовший: ${stats.max.title} (${stats.max.durationMin} хв)`,
  `Різних жанрів: ${stats.categories}`,
  `Середній рейтинг глядачів: ${stats.averageRating}`,
  "Прибуток кожного фільму (збори − бюджет):",
  films.map((film) => `  • ${film.title}: ${profitOf(film).toFixed(1)} млн $`).join("\n")
]);
