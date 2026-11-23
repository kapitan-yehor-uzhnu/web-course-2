/* ===== Дані ===== */

// Фільми тепер лежать у data.json і завантажуються через fetch у loadData().
// let, а не const: значення присвоюється пізніше, коли файл уже прочитано.
let films = []; // заповнюється в init(); до LR10 був масивом у коді

// Те, чого немає в data.json, але потрібне карткам із LR5–LR7: постер, код сеансу,
// бейдж «Прем'єра» і закріплення. Ключ — назва фільму з файлу; сам файл не змінюємо.
const extras = {
  "Interstellar": { img: "images/poster-interstellar.svg", code: "CIN-2026-E05" },
  "Avatar": { img: "images/poster-avatar.svg", code: "CIN-2026-L06" },
  "Inception": { img: "images/poster-inception.svg", code: "CIN-2026-F14" },
  "The Lord of the Rings: The Fellowship of the Ring": {
    img: "images/poster-lotr.svg",
    code: "CIN-2026-M03"
  },
  "The Matrix": { img: "images/poster-matrix.svg", code: "CIN-2026-H18" },
  "Dune": { img: "images/poster-dune.svg", code: "CIN-2026-D21", premiere: true, pinned: true },
  "Blade Runner 2049": {
    img: "images/poster-blade-runner-2049.svg",
    code: "CIN-2026-B12",
    premiere: true
  },
  "The Dark Knight": { img: "images/poster-dark-knight.svg", code: "CIN-2026-G09" },
  "The Shawshank Redemption": { img: "images/poster-shawshank.svg", code: "CIN-2026-N11" },
  "Gladiator": { img: "images/poster-gladiator.svg", code: "CIN-2026-P07" }
};

// Жанри у файлі записано англійською — на сторінці показуємо українські назви
const genreNames = {
  "sci-fi": "фантастика",
  "drama": "драма",
  "adventure": "пригоди",
  "action": "бойовик",
  "fantasy": "фентезі",
  "thriller": "трилер",
  "crime": "кримінал",
  "epic": "епос",
  "historical": "історичний",
  "neo-noir": "неонуар"
};

/* ===== Функції обробки ===== */

// Приймає фільм — повертає дані для картки, яких немає у файлі (або заглушку для нового фільму)
const extraOf = (film) =>
  extras[film.title] ?? { img: "images/poster-banner.svg", code: "CIN-2026-—" };

// Приймає жанр із файлу — повертає його українську назву
const genreName = (genre) => genreNames[genre] ?? genre;

// Підписи для ключів вкладених об'єктів і масивів об'єктів із data.json
const fieldNames = {
  budget_million: "Бюджет",
  gross_worldwide_million: "Світові збори",
  name: "Актор",
  role: "Роль"
};

// Приймає ключ із файлу — повертає український підпис (або сам ключ, якщо підпису немає)
const fieldName = (key) => fieldNames[key] ?? key;

// Приймає суму в мільйонах доларів — повертає її повністю з розділювачами розрядів
const formatMoney = (millions) =>
  `${Math.round(millions * 1_000_000).toLocaleString("uk-UA")} $`;

// Приймає фільм — повертає прибуток у мільйонах: збори мінус бюджет (у даних його немає)
const profitOf = ({ boxOffice }) =>
  boxOffice.gross_worldwide_million - boxOffice.budget_million;

// Приймає фільм — повертає середню оцінку з одним знаком після коми або null без оцінок
const averageRating = ({ ratings }) =>
  ratings.length === 0
    ? null
    : (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1);

// Приймає масив фільмів і жанр — повертає фільми, серед жанрів яких є цей
const filterByGenre = (items, value) => items.filter((film) => film.genres.includes(value));

// Приймає масив фільмів і межі в хвилинах — повертає фільми з тривалістю в цих межах
const filterByDurationRange = (items, from, to) =>
  items.filter((film) => film.duration_min >= from && film.duration_min <= to);

// Приймає масив фільмів і запит у нижньому регістрі — повертає збіги за назвою або режисером
const filterByText = (items, query) =>
  items.filter(
    (film) =>
      film.title.toLowerCase().includes(query) || film.director.toLowerCase().includes(query)
  );

// Приймає масив фільмів — повертає НОВИЙ масив, відсортований за роком випуску
const sortByYear = (items) => [...items].sort((a, b) => a.year - b.year);

// Приймає масив фільмів — повертає НОВИЙ масив, відсортований за тривалістю
const sortByDuration = (items) => [...items].sort((a, b) => a.duration_min - b.duration_min);

// Приймає масив фільмів — повертає НОВИЙ масив, відсортований за назвою (українська абетка)
const sortByTitle = (items) => [...items].sort((a, b) => a.title.localeCompare(b.title, "uk"));

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
const loader = document.querySelector(".loader");
const loadError = document.getElementById("load-error");
const favOnlyBox = document.getElementById("fav-only");
const cacheNote = document.getElementById("cache-note");
const statsList = document.getElementById("stats-list");

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

/* ===== LR10: обране в localStorage ===== */

// Повертає масив id обраних фільмів зі сховища; захищено від порожнього й зіпсованого вмісту
function loadFavorites() {
  const raw = localStorage.getItem("favorites");
  if (!raw) return []; // ключа ще немає
  try {
    const list = JSON.parse(raw); // вміст могли зіпсувати вручну чи інший скрипт
    return Array.isArray(list) ? list : [];
  } catch (error) {
    return [];
  }
}

// Приймає масив id — зберігає його в сховищі рядком JSON
function saveFavorites(list) {
  localStorage.setItem("favorites", JSON.stringify(list));
}

let favorites = loadFavorites();

// Приймає id фільму — додає його до обраного або прибирає, повертає новий стан
const toggleFavorite = (id) => {
  const added = !favorites.includes(id);
  favorites = added ? [...favorites, id] : favorites.filter((favId) => favId !== id);
  saveFavorites(favorites);
  return added;
};

// Приймає кнопку-сердечко і стан — оновлює її вигляд і підказку для читалки
const paintFavButton = (button, isFavorite) => {
  button.textContent = isFavorite ? "❤️" : "🤍";
  button.setAttribute("aria-pressed", String(isFavorite));
};

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

// Приймає хвилини — повертає рядок на кшталт «2 год 28 хв»
const formatDuration = (minutes) =>
  `${Math.floor(minutes / 60)} год ${String(minutes % 60).padStart(2, "0")} хв`;

// Приймає фільм — повертає готову картку
const createCard = (item) => {
  const card = document.createElement("article");
  // Закріплена картка стоїть першою лише у звичайному порядку, інакше ламала б сортування
  const extra = extraOf(item);
  const pinned = extra.pinned === true && activeSort === "default";
  card.className = pinned ? "card card--glass card--pinned" : "card";
  card.dataset.id = item.id;

  const fav = makeElement("button", "fav");
  fav.type = "button";
  fav.dataset.id = item.id;
  fav.setAttribute("aria-label", `Додати «${item.title}» до обраного`);
  paintFavButton(fav, favorites.includes(item.id));

  const badge = makeElement(
    "span",
    extra.premiere ? "card__badge" : "card__badge card__badge--out",
    extra.premiere ? "Прем'єра" : "У прокаті"
  );

  const img = makeElement("img", "card__img");
  img.src = extra.img;
  img.alt = `Постер фільму «${item.title}»`;
  img.width = 400;
  img.height = 600;
  img.loading = "lazy";

  const overlay = makeElement("span", "card__overlay", item.title);
  overlay.setAttribute("aria-hidden", "true");

  const heading = makeElement("h3", "card__title");
  fillTitle(heading, item.title, activeQuery);

  // Рядок «рейтинг · тривалість · жанри»: рейтинг і тривалість мають власні стилі з LR4
  const rating = averageRating(item);
  const excerpt = makeElement("p", "card__excerpt");
  excerpt.append(
    makeElement("span", "rating", rating === null ? "без оцінок" : `★ ${rating}`),
    " · ",
    makeElement("span", "duration", formatDuration(item.duration_min)),
    ` · ${item.genres.map(genreName).join(", ")}`
  );

  const body = makeElement("div", "card__body");
  body.append(
    heading,
    makeElement("p", "card__meta", `${item.year} · реж. ${item.director}`),
    excerpt,
    makeElement("p", "card__id", `Код сеансу: ${extra.code}`)
  );

  const details = makeElement("button", "card__preview", "Детальніше");
  details.type = "button";
  const booking = makeElement("a", "card__action", "Забронювати");
  booking.href = "form.html";
  const actions = makeElement("div", "card__actions");
  actions.append(details, booking);

  card.append(fav, badge, img, overlay, body, actions);
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
  const byText = filterByText(filterByDurationRange(byGenre, from, to), query);
  const result = favOnlyBox.checked
    ? byText.filter((film) => favorites.includes(film.id))
    : byText;

  activeQuery = query;
  saveFilterState();
  renderCards(sorters[activeSort](result));
  resultCount.textContent = `Показано ${result.length} із ${films.length}`;
  emptyMessage.hidden = result.length > 0;
  // Запит показуємо лише через textContent: навіть розмітка в ньому лишиться текстом
  emptyMessage.textContent =
    typed === ""
      ? "Нічого не знайдено. Спробуйте інший запит."
      : `За запитом «${typed}» нічого не знайдено. Спробуйте інший запит.`;
};

// Приймає кнопку — запам'ятовує порядок і позначає активну кнопку (без перемальовування)
const markSort = (button) => {
  activeSort = button.dataset.sort;
  for (const item of sortButtons.querySelectorAll("button")) {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  }
};

// Приймає натиснуту кнопку — змінює порядок і перемальовує список
const selectSort = (button) => {
  markSort(button);
  applyFilters();
};

/* ===== LR10, бонус 2: стан фільтрів у localStorage ===== */

// Зберігає запит, жанр і порядок одним об'єктом під ключем filters
const saveFilterState = () => {
  const state = { query: searchInput.value, genre: genreSelect.value, sort: activeSort };
  localStorage.setItem("filters", JSON.stringify(state));
};

// Повертає збережений стан фільтрів або null, якщо його немає чи він зіпсований
const loadFilterState = () => {
  const raw = localStorage.getItem("filters");
  if (!raw) return null;
  try {
    const state = JSON.parse(raw);
    return state !== null && typeof state === "object" ? state : null;
  } catch (error) {
    return null;
  }
};

// Повертає полям вигляд зі сховища. Викликається лише після завантаження даних:
// до того в списку «Жанр» ще немає варіантів, і збережений жанр нікуди було б поставити
const restoreFilters = () => {
  const state = loadFilterState();
  if (state === null) return;
  if (typeof state.query === "string") searchInput.value = state.query;
  const option = genreSelect.querySelector(`option[value="${CSS.escape(String(state.genre))}"]`);
  if (option) {
    genreSelect.value = option.value;
    document.querySelector(`input[name="genre"][value="${CSS.escape(option.value)}"]`).checked = true;
  }
  const button = sortButtons.querySelector(`button[data-sort="${CSS.escape(String(state.sort))}"]`);
  if (button && state.sort in sorters) markSort(button);
};

// Приймає масив фільмів — додає в список «Жанр» і бічну колонку всі жанри з даних,
// щоб варіанти фільтра ніколи не розійшлися з data.json
const fillGenreOptions = (items) => {
  const genres = [...new Set(items.flatMap((film) => film.genres))].sort((a, b) =>
    genreName(a).localeCompare(genreName(b), "uk")
  );
  const radios = document.querySelector(".genre-filter");
  // Свіжі дані з мережі можуть прийти після кешованих: прибираємо старі варіанти,
  // щоб жанри не дублювалися, і зберігаємо вибір, якщо такий жанр лишився
  const chosen = genreSelect.value;
  for (const option of genreSelect.querySelectorAll('option:not([value="all"])')) option.remove();
  for (const radio of radios.querySelectorAll('input[name="genre"]:not([value="all"])')) {
    radio.closest("label").remove();
  }
  for (const genre of genres) {
    const option = makeElement("option", "", genreName(genre));
    option.value = genre;
    genreSelect.append(option);

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "genre";
    radio.id = `genre-${genre}`;
    radio.value = genre;
    const label = document.createElement("label");
    label.htmlFor = radio.id;
    const text = genreName(genre);
    label.append(radio, ` ${text[0].toUpperCase()}${text.slice(1)}`);
    radios.append(label);
  }
  const keep = genres.includes(chosen) ? chosen : "all";
  genreSelect.value = keep;
  document.querySelector(`input[name="genre"][value="${keep}"]`).checked = true;
};

// Приймає жанр — узгоджує список над каталогом і перемикачі в бічній колонці
const selectGenre = (genre) => {
  genreSelect.value = genre;
  document.querySelector(`input[name="genre"][value="${genre}"]`).checked = true;
  applyFilters();
};

// Приймає заголовок і вміст — повертає секцію модалки «заголовок + вміст»
const detailsSection = (title, ...content) => {
  const section = document.createElement("div");
  section.append(makeElement("h4", "", title), ...content);
  return section;
};

// Приймає масив рядків і текст для порожнього масиву — повертає список <ul> або абзац
const stringList = (values, emptyText) => {
  if (values.length === 0) return makeElement("p", "details__empty", emptyText);
  const list = document.createElement("ul");
  for (const value of values) list.append(makeElement("li", "", value));
  return list;
};

// Приймає масив об'єктів — повертає таблицю, стовпці якої — ключі першого елемента
const objectTable = (rows, emptyText) => {
  if (rows.length === 0) return makeElement("p", "details__empty", emptyText);
  const keys = Object.keys(rows[0]);
  const headRow = document.createElement("tr");
  for (const key of keys) headRow.append(makeElement("th", "", fieldName(key)));
  const thead = document.createElement("thead");
  thead.append(headRow);
  const tbody = document.createElement("tbody");
  for (const row of rows) {
    const tr = document.createElement("tr");
    // null чи відсутнє поле показуємо рискою, щоб клітинка не була порожньою
    for (const key of keys) tr.append(makeElement("td", "", String(row[key] ?? "—")));
    tbody.append(tr);
  }
  const table = document.createElement("table");
  table.append(thead, tbody);
  // Обгортка прокручує широку таблицю на вузькому екрані, а не всю сторінку
  const wrap = makeElement("div", "table-wrap");
  wrap.append(table);
  return wrap;
};

// Приймає фільм — будує всю деталізацію в модальному вікні і відкриває його
const openDetails = (item) => {
  const main = document.getElementById("d-main");
  const object = document.getElementById("d-object");
  const list = document.getElementById("d-list");
  const table = document.getElementById("d-table");
  // Очищаємо все перед заповненням, інакше дані попереднього фільму змішалися б із новими
  main.replaceChildren();
  object.replaceChildren();
  list.replaceChildren();
  table.replaceChildren();

  document.getElementById("d-title").textContent = item.title;

  // Прості поля — парами «підпис — значення» у списку означень
  const rating = averageRating(item);
  const facts = [
    ["Код сеансу", extraOf(item).code],
    ["Рік", String(item.year)],
    ["Режисер", item.director],
    ["Тривалість", formatDuration(item.duration_min)],
    ["Жанри", item.genres.map(genreName).join(", ")],
    [
      "Оцінки глядачів",
      rating === null ? "оцінок ще немає" : `${item.ratings.join(", ")} (середня ${rating})`
    ]
  ];
  const dl = document.createElement("dl");
  for (const [label, value] of facts) {
    dl.append(makeElement("dt", "", label), makeElement("dd", "", value));
  }
  main.append(dl);

  // Касові збори: ключі вкладеного об'єкта перебираємо, а прибуток рахуємо самі
  const money = document.createElement("dl");
  for (const [key, value] of Object.entries(item.boxOffice)) {
    money.append(makeElement("dt", "", fieldName(key)), makeElement("dd", "", formatMoney(value)));
  }
  const profit = profitOf(item);
  money.append(
    makeElement("dt", "", "Прибуток (збори − бюджет)"),
    makeElement("dd", profit < 0 ? "details__loss" : "", formatMoney(profit))
  );
  object.append(detailsSection("Касові збори", money));

  list.append(
    detailsSection("Місця зйомок", stringList(item.locations, "Місця зйомок не вказано"))
  );
  table.append(
    detailsSection("Акторський склад", objectTable(item.cast, "Акторський склад не вказано"))
  );

  dlg.showModal();
};

/* ===== LR10: завантаження даних ===== */

// fetch кидає помилку лише тоді, коли сервер узагалі не відповів (немає мережі).
// Відповідь «404» чи «500» для нього — успішна доставка, тож без перевірки
// response.ok до catch ми б не потрапили, а response.json() намагався б розібрати
// сторінку помилки як дані.
async function loadData() {
  const response = await fetch("data.json");

  if (!response.ok) {
    throw new Error("HTTP " + response.status);
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Файл даних порожній або має неправильну структуру");
  }

  // У файлі немає id, а картки знаходять свій фільм саме за ним (data-id),
  // тому додаємо номер за порядком у копії — сам data.json лишається незмінним
  return data.map((film, index) => ({ ...film, id: index + 1 }));
}

// Приймає помилку — показує над каталогом зрозуміле повідомлення замість карток
// Не лише console.error: людина консолі не бачить, а порожня сторінка для неї — «сайт зламався»
const showLoadError = (error) => {
  loadError.hidden = false;
  loadError.textContent =
    "Не вдалося завантажити каталог. Перевірте з'єднання і " +
    "оновіть сторінку. Технічні подробиці: " + error.message;
  resultCount.textContent = "";
};

/* LR10, бонус 6: та сама функція на ланцюжку then/catch — для порівняння, не викликається.

function loadDataWithThen() {
  return fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      return response.json(); // без return наступний then отримав би undefined
    })
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Файл даних порожній або має неправильну структуру");
      }
      return data.map((film, index) => ({ ...film, id: index + 1 }));
    });
}

// Виклик виглядав би так:
// loadDataWithThen()
//   .then((list) => showFilms(list))
//   .catch((error) => showLoadError(error))
//   .finally(() => { loader.hidden = true; });
*/

/* ===== LR10, бонус 5: кеш даних у localStorage ===== */

// Зберігає копію фільмів разом із часом, коли її отримано
const saveCache = (list) => {
  try {
    localStorage.setItem("filmsCache", JSON.stringify({ savedAt: Date.now(), films: list }));
  } catch (error) {
    // Сховище переповнене чи заборонене — каталог працює й без кешу
  }
};

// Повертає { savedAt, films } зі сховища або null, якщо кешу немає чи його зіпсовано
const loadCache = () => {
  const raw = localStorage.getItem("filmsCache");
  if (!raw) return null;
  try {
    const cache = JSON.parse(raw);
    const valid =
      cache !== null &&
      typeof cache.savedAt === "number" &&
      Array.isArray(cache.films) &&
      cache.films.length > 0;
    return valid ? cache : null;
  } catch (error) {
    return null;
  }
};

let filtersRestored = false;

// Приймає масив фільмів — кладе його в films і перемальовує каталог
const showFilms = (list) => {
  films = list;
  // Список жанрів і фільтри — лише після отримання даних: до того масив порожній
  fillGenreOptions(films);
  // Стан зі сховища повертаємо один раз — далі поля вже змінює людина
  if (!filtersRestored) {
    restoreFilters();
    filtersRestored = true;
  }
  applyFilters();
};

// Завантажує дані й лише після цього малює каталог.
// Якщо є кеш — показує його одразу, а свіжі дані підвантажує у фоні
async function init() {
  const cache = loadCache();
  if (cache !== null) {
    showFilms(cache.films);
    loader.hidden = true;
    cacheNote.hidden = false;
    cacheNote.textContent =
      `Дані з кешу від ${new Date(cache.savedAt).toLocaleString("uk-UA")}. Оновлюємо…`;
  }

  try {
    const fresh = await loadData();
    const changed = cache === null || JSON.stringify(fresh) !== JSON.stringify(cache.films);
    saveCache(fresh);
    if (changed) showFilms(fresh);
    if (cache !== null && changed) showToast("Каталог оновлено свіжими даними");
    cacheNote.hidden = true;
  } catch (error) {
    if (cache === null) {
      showLoadError(error);
    } else {
      // Кешований каталог уже на сторінці — лише попереджаємо, що він може бути застарілим
      cacheNote.textContent =
        `Дані з кешу від ${new Date(cache.savedAt).toLocaleString("uk-UA")}. ` +
        "Оновити не вдалося — перевірте з'єднання.";
    }
  } finally {
    // Лише тут: якби спінер ховався в кінці try, то при помилці до того рядка
    // справа б не дійшла, і спінер крутився б поруч із повідомленням про помилку
    loader.hidden = true;
  }
}

/* ===== LR10, бонус 1: сторінка «Статистика» з відкритим API ===== */

// Адреса фільму в SWAPI — публічному API без ключа
const STATS_URL = "https://swapi.dev/api/films/1/";

// Приймає дату «РРРР-ММ-ДД» — повертає її українською, напр. «25 травня 1977 р.»
const formatReleaseDate = (text) =>
  new Date(text).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });

// Завантажує фільм з API і показує шість полів відповіді; при помилці — повідомлення
async function loadStats() {
  const statsError = document.getElementById("stats-error");
  loader.hidden = false;
  try {
    const response = await fetch(STATS_URL);
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    const film = await response.json();
    const fields = [
      ["Назва", film.title],
      ["Епізод", String(film.episode_id)],
      ["Режисер", film.director],
      ["Продюсери", film.producer],
      ["Дата прем'єри", formatReleaseDate(film.release_date)],
      ["Персонажів у фільмі", String(film.characters.length)]
    ];
    for (const [label, value] of fields) {
      statsList.append(makeElement("dt", "", label), makeElement("dd", "", value));
    }
  } catch (error) {
    statsError.hidden = false;
    statsError.textContent =
      "Не вдалося отримати дані з API. Перевірте з'єднання і оновіть сторінку. " +
      "Технічні подробиці: " + error.message;
  } finally {
    loader.hidden = true;
  }
}

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

/* ===== LR9: запуск і події ===== */

if (statsList !== null) {
  loadStats();
}

if (cards !== null) {
  loader.hidden = false;
  init();

  let searchTimer;

  // input спрацьовує на кожен введений символ, а change — лише коли поле втратить фокус.
  // Затримка: шукаємо, коли людина на 300 мс перестала друкувати, а не на кожну літеру
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 300);
  });
  durationFrom.addEventListener("input", applyFilters);
  durationTo.addEventListener("input", applyFilters);
  favOnlyBox.addEventListener("change", applyFilters);
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
    favOnlyBox.checked = false;
    markSort(sortButtons.querySelector('button[data-sort="default"]'));
    selectGenre("all");
    // Після selectGenre: applyFilters усередині знову записав би стан у сховище
    localStorage.removeItem("filters");
    showToast("Фільтри скинуто");
  });

  // Клік із картки спливає до контейнера, а контейнер не перемальовується, тому
  // один слухач на ньому працює і для карток, створених уже після підписки.
  cards.addEventListener("click", (event) => {
    // Сердечко перемикає обране й вікна не відкриває
    const favButton = event.target.closest(".fav");
    if (favButton) {
      const added = toggleFavorite(Number(favButton.dataset.id));
      // У режимі «тільки обране» картка має зникнути, тож перемальовуємо список;
      // інакше міняємо лише цю кнопку, і фокус клавіатури лишається на ній
      if (favOnlyBox.checked) {
        applyFilters();
      } else {
        paintFavButton(favButton, added);
      }
      showToast(added ? "Додано до обраного" : "Прибрано з обраного");
      return;
    }
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
  // Спершу вибір людини зі сховища: він свідомий і важливіший за загальне налаштування системи
  const saved = localStorage.getItem("theme"); // "dark" | "light" | null
  if (saved) {
    applyTheme(saved === "dark");
  } else {
    applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  themeButton.addEventListener("click", () => {
    const next = !isDark();
    applyTheme(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  });
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
