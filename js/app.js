// Тимчасова перевірка підключення — прибрати наприкінці роботи
console.log("app.js підключено");

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
    genre: "драма",
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

// Записує текст у вказаний елемент. Масив рядків склеює переносами.
const show = (id, value) => {
  const box = document.getElementById(id);
  if (box === null) {
    console.error("Немає елемента з id:", id);
    return;
  }
  box.textContent = Array.isArray(value) ? value.join("\n") : value;
};
