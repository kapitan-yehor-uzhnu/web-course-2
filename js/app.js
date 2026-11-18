/* ===== Дані ===== */

// Фільми кінотеатру «Кіносвіт»: дані взято з variants-data/variant04.json, а постери,
// описи й коди сеансів — зі статичних карток LR5–LR7. У LR10 цей масив переїде
// у зовнішній data.json і завантажуватиметься через fetch.
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
    genres: ["фантастика", "бойовик", "трилер"],
    premiere: false,
    pinned: false,
    code: "CIN-2026-F14",
    img: "images/poster-inception.svg",
    description: "Домінік Кобб викрадає секрети зі снів, а тепер мусить зробити протилежне — непомітно вкласти ідею в підсвідомість спадкоємця корпорації.",
    boxOffice: { budgetMillion: 160, grossMillion: 839 },
    ratings: [9, 8.5, 10, 9, 8],
    cast: [
      { name: "Леонардо Ді Капріо", role: "Домінік Кобб" },
      { name: "Джозеф Гордон-Левітт", role: "Артур" },
      { name: "Елліот Пейдж", role: "Аріадна" }
    ]
  },
  {
    id: 2,
    title: "Темний лицар",
    director: "Крістофер Нолан",
    year: 2008,
    durationMin: 152,
    genre: "бойовик",
    genres: ["бойовик", "кримінал", "драма"],
    premiere: false,
    pinned: false,
    code: "CIN-2026-G09",
    img: "images/poster-dark-knight.svg",
    description: "Бетмен, комісар Гордон і прокурор Гарві Дент очищають Готем від злочинності, доки в місті не з'являється Джокер, що сіє хаос заради хаосу.",
    boxOffice: { budgetMillion: 185, grossMillion: 1006 },
    ratings: [10, 9.5, 9, 10],
    cast: [
      { name: "Крістіан Бейл", role: "Брюс Вейн / Бетмен" },
      { name: "Гіт Леджер", role: "Джокер" },
      { name: "Аарон Екгарт", role: "Гарві Дент" }
    ]
  },
  {
    id: 3,
    title: "Титанік",
    director: "Джеймс Кемерон",
    year: 1997,
    durationMin: 194,
    genre: "мелодрама",
    genres: ["драма", "мелодрама", "історичний"],
    premiere: false,
    pinned: false,
    code: "CIN-2026-K11",
    img: "images/poster-titanic.svg",
    description: "Художник Джек і аристократка Роуз знайомляться на борту «Титаніка» під час його першого рейсу, який закінчиться зіткненням з айсбергом.",
    boxOffice: { budgetMillion: 200, grossMillion: 2264.7 },
    ratings: [8, 9, 7.5],
    cast: [
      { name: "Леонардо Ді Капріо", role: "Джек Доусон" },
      { name: "Кейт Вінслет", role: "Роуз Девітт Б'юкейтер" },
      { name: "Біллі Зейн", role: "Кел Гоклі" }
    ]
  },
  {
    id: 4,
    title: "Матриця",
    director: "Лана і Ліллі Вачовскі",
    year: 1999,
    durationMin: 136,
    genre: "фантастика",
    genres: ["фантастика", "бойовик"],
    premiere: false,
    pinned: false,
    code: "CIN-2026-H18",
    img: "images/poster-matrix.svg",
    description: "Хакер Нео дізнається, що звичний світ — лише симуляція, створена машинами, і приєднується до повстанців Морфеуса, щоб вирватися з неї.",
    boxOffice: { budgetMillion: 63, grossMillion: 467.2 },
    ratings: [9, 9, 8.5, 10, 9],
    cast: [
      { name: "Кіану Рівз", role: "Нео" },
      { name: "Лоуренс Фішберн", role: "Морфеус" },
      { name: "Керрі-Енн Мосс", role: "Трініті" }
    ]
  },
  {
    id: 5,
    title: "Дюна",
    director: "Дені Вільнев",
    year: 2021,
    durationMin: 155,
    genre: "пригоди",
    genres: ["фантастика", "пригоди", "драма"],
    premiere: true,
    pinned: true,
    code: "CIN-2026-D21",
    img: "images/poster-dune.svg",
    description: "Юний Пол Атрід разом із родиною прибуває на пустельну планету Арракіс — єдине джерело найціннішої речовини у Всесвіті, за яку точиться смертельна боротьба.",
    boxOffice: { budgetMillion: 165, grossMillion: 407.6 },
    ratings: [9, 8, 8.5],
    cast: [
      { name: "Тімоті Шаламе", role: "Пол Атрід" },
      { name: "Ребекка Фергюсон", role: "леді Джессіка" },
      { name: "Оскар Айзек", role: "герцог Лето Атрід" }
    ]
  },
  {
    id: 6,
    title: "Гравітація",
    director: "Альфонсо Куарон",
    year: 2013,
    durationMin: 91,
    genre: "трилер",
    genres: ["фантастика", "трилер", "драма"],
    premiere: false,
    pinned: false,
    code: "CIN-2026-J02",
    img: "images/poster-gravity.svg",
    description: "Після зіткнення з уламками на орбіті інженерка Раян Стоун лишається сама у відкритому космосі й мусить дістатися до найближчої станції.",
    boxOffice: { budgetMillion: 100, grossMillion: 723.2 },
    ratings: [8, 7.5],
    cast: [
      { name: "Сандра Буллок", role: "Раян Стоун" },
      { name: "Джордж Клуні", role: "Метт Ковальскі" },
      { name: "Ед Гарріс", role: "Центр керування польотами (голос)" }
    ]
  },
  {
    id: 7,
    title: "Інтерстеллар",
    director: "Крістофер Нолан",
    year: 2014,
    durationMin: 169,
    genre: "фантастика",
    genres: ["фантастика", "драма", "пригоди"],
    premiere: false,
    pinned: false,
    code: "CIN-2026-E05",
    img: "images/poster-interstellar.svg",
    description: "Колишній пілот Купер разом із командою науковців вирушає крізь червоточину, щоб знайти нову домівку для людства, поки Земля потерпає від посухи.",
    boxOffice: { budgetMillion: 165, grossMillion: 758.6 },
    ratings: [10, 9, 9.5, 10, 8.5],
    cast: [
      { name: "Метью Макконахі", role: "Купер" },
      { name: "Енн Гетевей", role: "Амелія Бренд" },
      { name: "Джессіка Честейн", role: "Мерф" }
    ]
  },
  {
    id: 8,
    title: "Аватар",
    director: "Джеймс Кемерон",
    year: 2009,
    durationMin: 162,
    genre: "фантастика",
    genres: ["фантастика", "пригоди", "бойовик"],
    premiere: false,
    pinned: false,
    code: "CIN-2026-L06",
    img: "images/poster-avatar.svg",
    description: "Колишній морський піхотинець Джейк Саллі в тілі аватара потрапляє до народу наві на Пандорі й мусить обрати, на чиєму він боці.",
    boxOffice: { budgetMillion: 237, grossMillion: 2923.7 },
    ratings: [8, 8.5, 7.5, 9, 8],
    cast: [
      { name: "Сем Вортінгтон", role: "Джейк Саллі" },
      { name: "Зої Салдана", role: "Нейтірі" },
      { name: "Сігурні Вівер", role: "Грейс Августин" }
    ]
  },
  {
    id: 9,
    title: "Шалений Макс: Дорога гніву (Mad Max: Fury Road)",
    director: "Джордж Міллер",
    year: 2015,
    durationMin: 120,
    genre: "бойовик",
    genres: ["бойовик", "пригоди", "фантастика"],
    premiere: false,
    pinned: false,
    code: "CIN-2026-C03",
    img: "images/poster-mad-max.svg",
    description: "У випаленій пустелі Макс і Імператор Фуріоса тікають на бойовій вантажівці від тирана Безсмертного Джо, рятуючи його полонених дружин.",
    boxOffice: { budgetMillion: 154, grossMillion: 380.4 },
    ratings: [8.5, 9, 8, 7.5, 9],
    cast: [
      { name: "Том Гарді", role: "Макс Рокатанскі" },
      { name: "Шарліз Терон", role: "Імператор Фуріоса" },
      { name: "Ніколас Голт", role: "Нюкс" }
    ]
  },
  {
    id: 10,
    title: "Той, що біжить по лезу 2049 (Blade Runner 2049)",
    director: "Дені Вільнев",
    year: 2017,
    durationMin: 164,
    genre: "фантастика",
    genres: ["фантастика", "драма", "трилер"],
    premiere: false,
    pinned: false,
    code: "CIN-2026-B12",
    img: "images/poster-blade-runner-2049.svg",
    description: "Офіцер поліції К натрапляє на давно поховану таємницю, яка може зруйнувати крихкий порядок суспільства, і вирушає на пошуки зниклого Ріка Декарда.",
    boxOffice: { budgetMillion: 150, grossMillion: 276.6 },
    ratings: [8.5, 9, 7, 8, 9.5],
    cast: [
      { name: "Раян Гослінг", role: "К" },
      { name: "Гаррісон Форд", role: "Рік Декард" },
      { name: "Ана де Армас", role: "Джой" }
    ]
  },
  {
    id: 11,
    title: "Серце звіра",
    director: "Девід Ейр",
    year: 2026,
    durationMin: 101,
    genre: "пригоди",
    genres: ["пригоди", "драма", "трилер"],
    premiere: true,
    pinned: false,
    code: "CIN-2026-A07",
    img: "images/poster-heart-of-the-beast.svg",
    description: "Колишній солдат і його пес-вівчарка лишаються самі серед засніжених гір Аляски після аварії літака й мусять протриматися до приходу рятувальників.",
    boxOffice: { budgetMillion: null, grossMillion: null },
    ratings: [],
    cast: [
      { name: "Бред Пітт", role: "Джеймс Белмонт" },
      { name: "Дж. К. Сіммонс", role: null },
      { name: "Анна Ламбе", role: null }
    ]
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

// Приймає суму в мільйонах або null — повертає підпис для сторінки
const moneyText = (value) =>
  value === null ? "ще немає даних" : `${Number(value.toFixed(1))} млн $`;

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
      `${i + 1}. ${film.title} — ${film.director}, ${film.year} (збори: ${moneyText(film.boxOffice.grossMillion)})`
    );
  }
  return lines;
};

// Приймає масив фільмів і жанр — повертає фільми, серед жанрів яких є цей
const filterByGenre = (items, value) => items.filter((film) => film.genres.includes(value));

// Приймає масив фільмів і межі в хвилинах — повертає фільми з тривалістю в цих межах
const filterByDurationRange = (items, from, to) =>
  items.filter((film) => film.durationMin >= from && film.durationMin <= to);

// Приймає масив фільмів і запит у нижньому регістрі — повертає збіги за назвою або режисером
const filterByText = (items, query) =>
  items.filter(
    (film) =>
      film.title.toLowerCase().includes(query) || film.director.toLowerCase().includes(query)
  );

// Приймає масив фільмів і кількість хвилин — повертає фільми, довші за цю тривалість
const filterByDurationOver = (items, minutes) =>
  items.filter((film) => film.durationMin > minutes);

// Приймає масив фільмів — повертає НОВИЙ масив, відсортований за роком випуску
const sortByYear = (items) => [...items].sort((a, b) => a.year - b.year);

// Приймає масив фільмів — повертає НОВИЙ масив, відсортований за тривалістю
const sortByDuration = (items) => [...items].sort((a, b) => a.durationMin - b.durationMin);

// Приймає масив фільмів — повертає НОВИЙ масив, відсортований за назвою (українська абетка)
const sortByTitle = (items) => [...items].sort((a, b) => a.title.localeCompare(b.title, "uk"));

// Приймає фільм — повертає прибуток у мільйонах доларів або null, якщо зборів ще немає
const profitOf = ({ boxOffice: { budgetMillion, grossMillion } }) =>
  budgetMillion === null || grossMillion === null ? null : grossMillion - budgetMillion;

// Приймає фільм з оцінками — повертає його середню оцінку глядачів
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
  // У прем'єри ще немає оцінок, тому середнє рахуємо лише за фільмами з оцінками
  const rated = items.filter((film) => film.ratings.length > 0);
  const ratingSum = rated.reduce((sum, film) => sum + averageRatingOf(film), 0);
  return {
    count: items.length,
    total,
    average: (total / items.length).toFixed(1),
    max,
    categories: new Set(items.map((film) => film.genre)).size,
    averageRating: (ratingSum / rated.length).toFixed(2)
  };
};

/* ===== Бонусні функції LR8 ===== */

// Приймає масив фільмів і рядок — повертає фільми, у назві, режисері чи оцінках
// яких трапляється цей підрядок (без урахування регістру)
const searchByText = (items, query) => {
  const needle = query.toLowerCase();
  return items.filter(
    (film) =>
      film.title.toLowerCase().includes(needle) ||
      film.director.toLowerCase().includes(needle) ||
      film.ratings.some((rating) => String(rating).includes(needle))
  );
};

// Приймає масив, назву поля рядком і кількість — повертає n записів із найбільшим значенням поля
const topBy = (items, field, n = 3) =>
  [...items].sort((a, b) => b[field] - a[field]).slice(0, n);

// Приймає фільм (одразу розбираючи потрібні поля) — повертає рядок для картки
const cardLine = ({ title, year, boxOffice: { grossMillion } }) =>
  `${title} (${year}), збори: ${moneyText(grossMillion)}`;

// Приймає масив фільмів — повертає об'єкт «назва групи → скільки фільмів у ній»
const countByCategory = (items) =>
  items.reduce((groups, film) => {
    const group = categoryOf(film);
    groups[group] = (groups[group] ?? 0) + 1;
    return groups;
  }, {});

// Приймає масив фільмів — повертає масив рядків-зауважень (порожній, якщо все гаразд)
const validate = (items) => {
  const notes = [];
  const expectedKeys = Object.keys(items[0]).join();
  items.forEach((film, index) => {
    const label = `Запис №${index + 1}`;
    if (Object.keys(film).join() !== expectedKeys) {
      notes.push(`${label}: інший набір полів, ніж у першого запису`);
    }
    if (typeof film.title !== "string" || film.title.trim() === "") {
      notes.push(`${label}: порожня назва`);
    }
    ["id", "year", "durationMin"].forEach((field) => {
      if (typeof film[field] !== "number") {
        notes.push(`${label}: поле ${field} не є числом (${JSON.stringify(film[field])})`);
      }
    });
    if (typeof film.boxOffice !== "object" || film.boxOffice === null) {
      notes.push(`${label}: немає вкладеного об'єкта boxOffice`);
    } else {
      ["budgetMillion", "grossMillion"].forEach((field) => {
        // null означає «зборів ще немає» — так записано прем'єру
        if (film.boxOffice[field] !== null && typeof film.boxOffice[field] !== "number") {
          notes.push(`${label}: boxOffice.${field} не є числом`);
        }
      });
    }
    if (!Array.isArray(film.ratings) || film.ratings.some((r) => typeof r !== "number")) {
      notes.push(`${label}: оцінки мають бути масивом чисел`);
    }
  });
  return notes;
};

/* ===== LR9: елементи сторінки =====
   Скрипт підключено на всіх сторінках, а елементи є не всюди, тому на «чужій»
   сторінці тут буде null, і відповідний блок у кінці файла просто не запуститься. */

const cards = document.getElementById("cards");
const searchInput = document.getElementById("q");
const genreSelect = document.getElementById("filter");
const durationFrom = document.getElementById("duration-from");
const durationTo = document.getElementById("duration-to");
const emptyMessage = document.getElementById("empty");
const resultCount = document.getElementById("count");
const sortButtons = document.getElementById("sort-buttons");
const dlg = document.getElementById("details");
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const themeButton = document.getElementById("theme");
const toast = document.getElementById("toast");
const bookingForm = document.getElementById("booking-form");

/* ===== LR9: картки каталогу ===== */

// Приймає тег, клас і текст — повертає новий елемент (текст лише через textContent)
const makeElement = (tag, className, text = "") => {
  const element = document.createElement(tag);
  if (className !== "") element.className = className;
  element.textContent = text;
  return element;
};

// Поточний стан каталогу: запит для підсвітки й обраний порядок карток
let activeQuery = "";
let activeSort = "default";

// Способи сортування для кнопок: ключ — значення data-sort
const sorters = {
  default: (items) => items,
  title: sortByTitle,
  year: sortByYear,
  duration: sortByDuration
};

// Приймає заголовок, назву й запит — виділяє збіг через <mark>, без розмітки в рядках
const fillTitle = (heading, title, query) => {
  const start = query === "" ? -1 : title.toLowerCase().indexOf(query);
  if (start === -1) {
    heading.textContent = title;
    return;
  }
  const end = start + query.length;
  const match = makeElement("mark", "", title.slice(start, end));
  heading.append(title.slice(0, start), match, title.slice(end));
};

// Приймає фільм — повертає готову картку
const createCard = (item) => {
  const card = document.createElement("article");
  // Закріплена картка стоїть першою лише у звичайному порядку, інакше ламала б сортування
  const pinned = item.pinned && activeSort === "default";
  card.className = pinned ? "card card--glass card--pinned" : "card";
  card.dataset.id = item.id;

  const badge = makeElement(
    "span",
    item.premiere ? "card__badge" : "card__badge card__badge--out",
    item.premiere ? "Прем'єра" : "У прокаті"
  );

  const img = makeElement("img", "card__img");
  img.src = item.img;
  img.alt = `Постер фільму «${item.title}»`;
  img.width = 400;
  img.height = 600;
  img.loading = "lazy";

  const overlay = makeElement("span", "card__overlay", item.title);
  overlay.setAttribute("aria-hidden", "true");

  const heading = makeElement("h3", "card__title");
  fillTitle(heading, item.title, activeQuery);

  const body = makeElement("div", "card__body");
  body.append(
    heading,
    makeElement("p", "card__meta", `${item.year} · реж. ${item.director}`),
    makeElement("p", "card__excerpt", item.description),
    makeElement("p", "card__id", `Код сеансу: ${item.code}`)
  );

  const details = makeElement("button", "card__preview", "Детальніше");
  details.type = "button";
  const booking = makeElement("a", "card__action", "Забронювати");
  booking.href = "form.html";
  const actions = makeElement("div", "card__actions");
  actions.append(details, booking);

  card.append(badge, img, overlay, body, actions);
  return card;
};

// Приймає масив фільмів — перемальовує сітку однією вставкою через фрагмент
const renderCards = (list) => {
  cards.replaceChildren();
  const fragment = document.createDocumentFragment();
  for (const item of list) {
    fragment.append(createCard(item));
  }
  cards.append(fragment);
};

// Читає панель керування — показує лише фільми, що відповідають усім умовам
const applyFilters = () => {
  const typed = searchInput.value.trim();
  const query = typed.toLowerCase();
  const genre = genreSelect.value;
  const from = durationFrom.value === "" ? 0 : Number(durationFrom.value);
  const to = durationTo.value === "" ? Infinity : Number(durationTo.value);

  const byGenre = genre === "all" ? films : filterByGenre(films, genre);
  const result = filterByText(filterByDurationRange(byGenre, from, to), query);

  activeQuery = query;
  renderCards(sorters[activeSort](result));
  resultCount.textContent = `Знайдено: ${result.length} із ${films.length}`;
  emptyMessage.hidden = result.length > 0;
  // Запит показуємо лише через textContent: навіть розмітка в ньому лишиться текстом
  emptyMessage.textContent =
    typed === ""
      ? "Нічого не знайдено. Спробуйте інший запит."
      : `За запитом «${typed}» нічого не знайдено. Спробуйте інший запит.`;
};

// Приймає натиснуту кнопку — запам'ятовує порядок і позначає активну кнопку
const selectSort = (button) => {
  activeSort = button.dataset.sort;
  for (const item of sortButtons.querySelectorAll("button")) {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  }
  applyFilters();
};

// Приймає жанр — узгоджує список над каталогом і перемикачі в бічній колонці
const selectGenre = (genre) => {
  genreSelect.value = genre;
  document.querySelector(`input[name="genre"][value="${genre}"]`).checked = true;
  applyFilters();
};

// Приймає хвилини — повертає рядок на кшталт «2 год 28 хв»
const formatDuration = (minutes) =>
  `${Math.floor(minutes / 60)} год ${String(minutes % 60).padStart(2, "0")} хв`;

// Приймає фільм — заповнює модальне вікно і відкриває його
const openDetails = (item) => {
  const cast = item.cast
    .map(({ name, role }) => (role === null ? name : `${name} — ${role}`))
    .join("; ");
  document.getElementById("d-title").textContent = item.title;
  document.getElementById("d-line1").textContent =
    `${item.code} · реж. ${item.director} · ${item.year} · ` +
    `${formatDuration(item.durationMin)} · ${item.genres.join(", ")}`;
  document.getElementById("d-line2").textContent = item.description;
  document.getElementById("d-line3").textContent = `Акторський склад: ${cast}`;
  dlg.showModal();
};

/* ===== LR9: меню, тема, повідомлення ===== */

// Приймає true/false — відкриває чи закриває меню і повідомляє стан читалці
const setMenu = (open) => {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
};

// Повертає true, якщо зараз діє темна тема: вибір кнопкою важливіший за систему
const isDark = () => {
  const root = document.documentElement;
  if (root.classList.contains("dark-theme")) return true;
  if (root.classList.contains("light-theme")) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

// Приймає true/false — вмикає тему й оновлює стан і підпис кнопки
const applyTheme = (dark) => {
  document.documentElement.classList.toggle("dark-theme", dark);
  document.documentElement.classList.toggle("light-theme", !dark);
  themeButton.setAttribute("aria-pressed", String(dark));
  themeButton.textContent = dark ? "☀️ Світла тема" : "🌙 Темна тема";
};

let toastTimer;

// Приймає текст — показує його на кілька секунд
const showToast = (text) => {
  toast.textContent = text;
  toast.hidden = false;
  // Без clearTimeout старий таймер сховав би вже нове повідомлення раніше строку
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2500);
};

/* ===== LR9: форма бронювання ===== */

// Приймає форму — повертає поля, які перевіряємо (перемикач типу квитка завжди обрано)
const fieldsOf = (form) =>
  form.querySelectorAll(
    'input:not([type="radio"]):not([type="checkbox"]), select, textarea, #consent'
  );

// Приймає поле — показує або прибирає його помилку, повертає true, якщо поле правильне
const checkField = (field) => {
  const ok = field.checkValidity();
  document.getElementById(`err-${field.id}`).textContent = ok ? "" : field.validationMessage;
  field.classList.toggle("invalid", !ok);
  field.setAttribute("aria-invalid", String(!ok));
  return ok;
};

// Приймає форму — перевіряє правило, яке HTML-атрибутами не описати:
// на вечірній сеанс дитина йде з дорослим, тож дитячий квиток не може бути єдиним
const checkChildTicket = (form) => {
  const type = form.querySelector('input[name="ticket_type"]:checked');
  const isChild = type !== null && type.value === "child";
  const isEvening = form.elements.session_time.value === "20:30";
  const isAlone = Number(form.elements.tickets.value) === 1;
  // Порожній рядок обов'язковий: інакше поле лишиться невалідним назавжди
  form.elements.tickets.setCustomValidity(
    isChild && isEvening && isAlone
      ? "На вечірній сеанс дитина йде з дорослим: потрібно щонайменше 2 квитки."
      : ""
  );
};

// Приймає форму — повертає рядки квитанції зі значень полів
const receiptLines = (form) => {
  const { fullname, email, phone, visit_date: date, film, session_time: time, tickets, comment } =
    form.elements;
  const type = form.querySelector('input[name="ticket_type"]:checked');
  const extras = [...form.querySelectorAll('input[name="extras"]:checked')].map((box) =>
    box.parentElement.textContent.trim()
  );
  return [
    `Глядач: ${fullname.value.trim()}`,
    `Контакти: ${email.value}, ${phone.value}`,
    `Фільм: ${film.selectedOptions[0].textContent}`,
    `Сеанс: ${date.value}, ${time.value}`,
    `Квитків: ${Number(tickets.value)}`,
    `Тип квитка: ${type === null ? "не обрано" : type.parentElement.textContent.trim()}`,
    `Додатково: ${extras.length > 0 ? extras.join(", ") : "нічого"}`,
    `Коментар: ${comment.value.trim() === "" ? "немає" : comment.value.trim()}`,
    `Згода на обробку даних: ${form.elements.consent.checked ? "так" : "ні"}`
  ];
};

// Приймає рядки — показує під формою квитанцію
const showReceipt = (lines) => {
  const list = document.getElementById("receipt-list");
  list.replaceChildren();
  for (const line of lines) {
    list.append(makeElement("li", "", line));
  }
  document.getElementById("receipt").hidden = false;
};

/* ===== Виведення результатів ===== */

// Блок «Демонстрація роботи» є лише в каталозі
if (document.getElementById("demo") !== null) {
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
    films.map((film) => `  • ${film.title}: ${moneyText(profitOf(film))}`).join("\n")
  ]);

  /* ----- Бонуси ----- */

  const queries = ["НОЛАН", "ма", "мюзикл"];
  show(
    "out-search",
    queries.map((query) => `Запит «${query}»: знайдено ${searchByText(films, query).length}\n${titlesOrEmpty(searchByText(films, query))}`)
  );

  show("out-top", [
    "Топ-3 найдовших:",
    topBy(films, "durationMin").map((film) => `  • ${film.title} — ${film.durationMin} хв`).join("\n"),
    "Топ-2 найновіших:",
    topBy(films, "year", 2).map((film) => `  • ${film.title} — ${film.year}`).join("\n")
  ]);

  show("out-lines", films.map(cardLine));

  show(
    "out-groups",
    Object.entries(countByCategory(films)).map(([group, count]) => `${group}: ${count}`)
  );

  const problems = validate(films);
  show("out-validate", problems.length === 0 ? "Помилок не знайдено" : problems);
}

/* ===== LR9: запуск і події ===== */

if (cards !== null) {
  applyFilters();

  let searchTimer;
  let inputEvents = 0;
  let searchRuns = 0;

  // input спрацьовує на кожен введений символ, а change — лише коли поле втратить фокус.
  // Затримка: шукаємо, коли людина на 300 мс перестала друкувати, а не на кожну літеру
  searchInput.addEventListener("input", () => {
    inputEvents += 1;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchRuns += 1;
      applyFilters();
      console.log(`Подій input: ${inputEvents}, виконано пошуків: ${searchRuns}`);
    }, 300);
  });
  durationFrom.addEventListener("input", applyFilters);
  durationTo.addEventListener("input", applyFilters);
  genreSelect.addEventListener("change", () => selectGenre(genreSelect.value));
  document.querySelector(".genre-filter").addEventListener("change", (event) => {
    selectGenre(event.target.value);
  });

  // Один обробник на всю групу: яку кнопку натиснули, підказує data-sort
  sortButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-sort]");
    if (button) selectSort(button);
  });

  document.getElementById("reset-filters").addEventListener("click", () => {
    searchInput.value = "";
    durationFrom.value = "";
    durationTo.value = "";
    selectGenre("all");
    showToast("Фільтри скинуто");
  });

  // Клік із картки спливає до контейнера, а контейнер не перемальовується, тому
  // один слухач на ньому працює і для карток, створених уже після підписки.
  cards.addEventListener("click", (event) => {
    // Посилання «Забронювати» веде на форму й вікна не відкриває
    if (event.target.closest("a")) return;
    const card = event.target.closest(".card");
    if (!card) return;
    const item = films.find((film) => film.id === Number(card.dataset.id));
    if (!item) return;
    openDetails(item);
  });

  document.getElementById("d-close").addEventListener("click", () => dlg.close());
}

if (burger !== null) {
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("open")) {
      setMenu(false);
      burger.focus();
    }
  });

  // Закриваємо меню кліком поза ним, а також після вибору пункту
  document.addEventListener("click", (event) => {
    if (event.target.closest("#burger")) return;
    if (!event.target.closest("#menu") || event.target.closest("#menu a")) {
      setMenu(false);
    }
  });
}

if (themeButton !== null) {
  applyTheme(isDark());
  themeButton.addEventListener("click", () => applyTheme(!isDark()));
}

if (bookingForm !== null) {
  const fields = fieldsOf(bookingForm);

  bookingForm.addEventListener("submit", (event) => {
    // Це лише підказка для людини: її легко обійти, тому дані по-справжньому перевіряє сервер.
    event.preventDefault();
    checkChildTicket(bookingForm);
    // map, а не every: помилку треба показати біля кожного поля, а не лише першого
    const results = [...fields].map(checkField);
    if (results.includes(false)) {
      bookingForm.querySelector(".invalid").focus();
      return;
    }
    showReceipt(receiptLines(bookingForm));
    showToast(`Бронювання прийнято: ${bookingForm.elements.fullname.value.trim()}`);
    bookingForm.reset();
  });

  // Коли людина виправляє поле, помилка зникає одразу, без повторної відправки
  const recheckInvalid = () => {
    checkChildTicket(bookingForm);
    for (const field of fields) {
      if (field.classList.contains("invalid")) checkField(field);
    }
  };
  bookingForm.addEventListener("input", recheckInvalid);
  bookingForm.addEventListener("change", recheckInvalid);

  // «Скинути форму» прибирає і значення, і повідомлення про помилки
  bookingForm.addEventListener("reset", () => {
    bookingForm.elements.tickets.setCustomValidity("");
    for (const field of fields) {
      field.classList.remove("invalid");
      field.removeAttribute("aria-invalid");
      document.getElementById(`err-${field.id}`).textContent = "";
    }
  });
}
