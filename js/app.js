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

  const body = makeElement("div", "card__body");
  body.append(
    heading,
    makeElement("p", "card__meta", `${item.year} · реж. ${item.director}`),
    makeElement(
      "p",
      "card__excerpt",
      `${formatDuration(item.duration_min)} · ${item.genres.map(genreName).join(", ")}`
    ),
    makeElement("p", "card__id", `Код сеансу: ${extra.code}`)
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

// Приймає фільм — заповнює модальне вікно і відкриває його
const openDetails = (item) => {
  const cast = item.cast
    .map(({ name, role }) => (role === null ? name : `${name} — ${role}`))
    .join("; ");
  document.getElementById("d-title").textContent = item.title;
  document.getElementById("d-line1").textContent =
    `${extraOf(item).code} · реж. ${item.director} · ${item.year} · ` +
    `${formatDuration(item.duration_min)} · ${item.genres.map(genreName).join(", ")}`;
  document.getElementById("d-line2").textContent = `Акторський склад: ${cast}`;
  document.getElementById("d-line3").textContent = `Місця зйомок: ${item.locations.join(", ")}`;
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
const showLoadError = (error) => {
  loadError.textContent =
    `Не вдалося завантажити каталог (${error.message}). ` +
    "Перевірте з'єднання й оновіть сторінку.";
  loadError.hidden = false;
  resultCount.textContent = "";
};

// Завантажує дані й лише після цього малює каталог
async function init() {
  loader.hidden = false;
  try {
    films = await loadData();
    applyFilters();
  } catch (error) {
    showLoadError(error);
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

if (cards !== null) {
  init();

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
