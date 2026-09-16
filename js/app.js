
/* =========================
   DREAM MUSIC
   MAIN JAVASCRIPT
========================= */


/* MUSIC DATA */

const music = [

  {
    id: 1,
    title: "สิทธิ์ของเธอ",
    artist: "อัสนี & วสันต์",
    type: "เพลง",
    emoji: "⭐",
    color1: "#f7b733",
    color2: "#fc4a1a",
    duration: 180,
    audio: "music/song.mp3"
  },

  {
    id: 2,
    title: "Midnight City",
    artist: "Neon Wave",
    type: "เพลง",
    emoji: "🌃",
    color1: "#1d2b64",
    color2: "#5c258d",
    duration: 210
  },

  {
    id: 3,
    title: "Ocean Breeze",
    artist: "Blue Room",
    type: "เพลง",
    emoji: "🌊",
    color1: "#00c6ff",
    color2: "#0072ff",
    duration: 190
  },

  {
    id: 4,
    title: "Study Focus",
    artist: "Lo-Fi Lab",
    type: "เพลง",
    emoji: "📚",
    color1: "#4568dc",
    color2: "#b06ab3",
    duration: 200
  },

  {
    id: 5,
    title: "Green Planet",
    artist: "Eco Beats",
    type: "เพลง",
    emoji: "🌿",
    color1: "#11998e",
    color2: "#38ef7d",
    duration: 175
  },

  {
    id: 6,
    title: "Starry Night",
    artist: "Cosmic Notes",
    type: "เพลง",
    emoji: "🌌",
    color1: "#141e30",
    color2: "#243b55",
    duration: 220
  },

  {
    id: 7,
    title: "Tech Talk EP.01",
    artist: "Dream Podcast",
    type: "พอดแคสต์",
    emoji: "🎙️",
    color1: "#6a11cb",
    color2: "#2575fc",
    duration: 300
  },

  {
    id: 8,
    title: "Science Around Us",
    artist: "Mini Science",
    type: "พอดแคสต์",
    emoji: "🔬",
    color1: "#00b09b",
    color2: "#96c93d",
    duration: 270
  }

];


/* VARIABLES */

let favorites =
  JSON.parse(
    localStorage.getItem("dreamFavorites") || "[]"
  );

let currentMusic = null;

let currentIndex = -1;

let currentTime = 0;

let isPlaying = false;

let timer = null;


/* AUDIO - เพลงจริง */

const audio = new Audio();

audio.preload = "metadata";

audio.volume = 0.5;


/* SHORTCUT */

const $ = selector =>
  document.querySelector(selector);


/* =========================
   PAGE SYSTEM
========================= */

document
  .querySelectorAll(".nav")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        openPage(
          button.dataset.page
        );

      }
    );

  });


document
  .querySelectorAll(".primary")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        openPage(
          button.dataset.page
        );

      }
    );

  });


function openPage(page) {

  document
    .querySelectorAll(".page")
    .forEach(section => {

      section.classList.remove("active");

    });


  const target =
    document.getElementById(page);

  if (target) {

    target.classList.add("active");

  }


  document
    .querySelectorAll(".nav")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.page === page
      );

    });


  $("#sidebar")
    .classList.remove("open");


  if (page === "search") {

    renderSearch();

  }


  if (page === "library") {

    renderLibrary();

  }

}


/* MOBILE MENU */

$("#menuBtn")
  .addEventListener(
    "click",
    () => {

      $("#sidebar")
        .classList.toggle("open");

    }
  );


/* =========================
   MUSIC CARD
========================= */

function createCard(song) {

  const liked =
    favorites.includes(song.id);


  return `

    <article
      class="music-card"
      data-id="${song.id}"
    >

      <div
        class="cover"
        style="
          --color1:${song.color1};
          --color2:${song.color2};
        "
      >

        ${song.emoji}

      </div>


      <button
        class="card-like"
        data-like="${song.id}"
      >

        ${liked ? "♥" : "♡"}

      </button>


      <h3>
        ${song.title}
      </h3>


      <p>
        ${song.artist}
        ·
        ${song.type}
      </p>

    </article>

  `;

}


/* =========================
   HOME
========================= */

function renderHome() {

  $("#continueGrid").innerHTML =
    music
      .slice(0,4)
      .map(createCard)
      .join("");


  $("#recommendGrid").innerHTML =
    music
      .slice(2,7)
      .map(createCard)
      .join("");


  $("#podcastGrid").innerHTML =
    music
      .filter(
        song =>
          song.type === "พอดแคสต์"
      )
      .map(song => `

        <div class="podcast-card">

          <div
            class="podcast-cover"
            style="
              background:
              linear-gradient(
                135deg,
                ${song.color1},
                ${song.color2}
              );
            "
          >

            ${song.emoji}

          </div>

          <h3>
            ${song.title}
          </h3>

          <p>
            ${song.artist}
          </p>

          <button
            class="primary podcast-play"
            data-id="${song.id}"
          >
            ▶ ฟังตอนนี้
          </button>

        </div>

      `)
      .join("");


  bindCards();

}


/* =========================
   CARD EVENTS
========================= */

function bindCards() {

  document
    .querySelectorAll(".music-card")
    .forEach(card => {

      card.addEventListener(
        "click",
        event => {

          if (
            event.target
              .closest("[data-like]")
          ) {

            return;

          }

          playMusic(
            Number(card.dataset.id)
          );

        }
      );

    });


  document
    .querySelectorAll("[data-like]")
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          toggleFavorite(
            Number(button.dataset.like)
          );

        }
      );

    });


  document
    .querySelectorAll(".podcast-play")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          playMusic(
            Number(button.dataset.id)
          );

        }
      );

    });

}


/* =========================
   FAVORITE
========================= */

function toggleFavorite(id) {

  if (
    favorites.includes(id)
  ) {

    favorites =
      favorites.filter(
        item => item !== id
      );

    showToast(
      "นำออกจากเพลงที่ชอบแล้ว"
    );

  } else {

    favorites.push(id);

    showToast(
      "เพิ่มเพลงที่ชอบแล้ว ❤️"
    );

  }


  localStorage.setItem(
    "dreamFavorites",
    JSON.stringify(favorites)
  );


  renderHome();

  renderSearch();

  renderLibrary();


  if (
    currentMusic &&
    currentMusic.id === id
  ) {

    $("#likeBtn").textContent =
      favorites.includes(id)
        ? "♥"
        : "♡";

  }

}


/* PLAYER FAVORITE */

$("#likeBtn")
  .addEventListener(
    "click",
    () => {

      if (!currentMusic) {

        showToast(
          "เลือกเพลงก่อนนะ"
        );

        return;

      }

      toggleFavorite(
        currentMusic.id
      );

    }
  );


/* =========================
   SEARCH
========================= */

function renderSearch(
  filter = "all"
) {

  const keyword =
    (
      $("#searchInput")
        ?.value || ""
    )
      .toLowerCase()
      .trim();


  const result =
    music.filter(song => {

      const matchType =
        filter === "all" ||
        song.type === filter;


      const matchText =
        song.title
          .toLowerCase()
          .includes(keyword) ||

        song.artist
          .toLowerCase()
          .includes(keyword);


      return matchType && matchText;

    });


  if (!result.length) {

    $("#searchResults").innerHTML = `
      <p style="color:#999">
        ไม่พบรายการที่ค้นหา
      </p>
    `;

    return;

  }


  $("#searchResults").innerHTML =
    result
      .map(createCard)
      .join("");


  bindCards();

}


/* SEARCH INPUT */

$("#searchInput")
  .addEventListener(
    "input",
    () => {

      const active =
        document.querySelector(
          ".chip.active"
        );


      renderSearch(
        active?.dataset.filter ||
        "all"
      );

    }
  );


/* FILTER */

document
  .querySelectorAll(".chip")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".chip")
          .forEach(
            b =>
              b.classList.remove(
                "active"
              )
          );


        button.classList.add(
          "active"
        );


        renderSearch(
          button.dataset.filter
        );

      }
    );

  });


/* =========================
   LIBRARY
========================= */

function renderLibrary() {

  const active =
    document.querySelector(
      ".tab.active"
    );


  const mode =
    active?.dataset.library ||
    "favorites";


  let list;


  if (mode === "favorites") {

    list =
      music.filter(
        song =>
          favorites.includes(
            song.id
          )
      );

  } else {

    list =
      music.filter(
        song =>
          song.type === "เพลง"
      );

  }


  if (!list.length) {

    $("#libraryList").innerHTML = `

      <p style="color:#999">

        ยังไม่มีเพลงในรายการนี้ ❤️

      </p>

    `;

    return;

  }


  $("#libraryList").innerHTML =
    list.map(song => `

      <div class="library-row">

        <div
          class="row-cover"
          style="
            --color1:${song.color1};
            --color2:${song.color2};
          "
        >

          ${song.emoji}

        </div>


        <div>

          <b>
            ${song.title}
          </b>

          <small>
            ${song.artist}
          </small>

        </div>


        <span>
          ${song.type}
        </span>


        <button
          class="row-play"
          data-id="${song.id}"
        >
          ▶
        </button>

      </div>

    `)
    .join("");


  document
    .querySelectorAll(".row-play")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          playMusic(
           
