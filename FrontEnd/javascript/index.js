const WORKS_API = "http://localhost:5678/api/works";
const CATEGORIES_API = "http://localhost:5678/api/categories";

const gallery = document.getElementById("gallery");
const filtersContainer = document.getElementById("filters");


let works = [];       
let categories = [];  


fetch(CATEGORIES_API)
  .then(res => res.json())
  .then(data => {
    categories = data;

    
    const allBtn = document.createElement("button");
    allBtn.textContent = "Tous";
    allBtn.dataset.id = "all";
    allBtn.classList.add("active");
    filtersContainer.appendChild(allBtn);

    
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.textContent = cat.name;
      btn.dataset.id = String(cat.id);
      filtersContainer.appendChild(btn);
    });

    
    filtersContainer.addEventListener("click", (e) => {
      if (!e.target.matches("button")) return;

      
      filtersContainer.querySelectorAll("button")
        .forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      const id = e.target.dataset.id;
      if (id === "all") {
        displayWorks(works);
      } else {
        const filtered = works.filter(w => {
          const catId = w.categoryId ?? w.category?.id;
          return String(catId) === id;
        });
        displayWorks(filtered);
      }
    });
  })
  .catch(err => {
    console.error("Erreur catégories:", err);
    filtersContainer.innerHTML = "<p>Impossible de charger les filtres.</p>";
  });




function GetWorks() {
fetch(WORKS_API)
  .then(res => res.json())
  .then(data => {
    works = data;
    displayWorks(works); 
  })
  .catch(err => {
    console.error("Erreur works:", err);
    gallery.innerHTML = "<p>Impossible de charger la galerie.</p>";
  });

}
GetWorks();

function displayWorks(list) {
  gallery.innerHTML = "";
  const frag = document.createDocumentFragment();

  list.forEach(item => {
    const figure = document.createElement("figure");
    figure.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.title}">
      <figcaption>${item.title}</figcaption>
    `;
    frag.appendChild(figure);
  });

  gallery.appendChild(frag);
}

const loginLink   = document.getElementById("login");
const logoutLink  = document.getElementById("logout");
const editionBar  = document.getElementById("editionbar");
const filtersWrap = document.getElementById("filters");
const edit = document.getElementById("edit");


function safeDisplay(el, value) {
  if (el) el.style.display = value;
}

function applyAuthUI(isLogged) {
  if (isLogged) {
    // connecté
    safeDisplay(loginLink,  "none");
    safeDisplay(logoutLink, "inline");
    safeDisplay(editionBar, "flex");
    safeDisplay(filtersWrap, "none");
    safeDisplay(edit, "block")   
  } else {
    // non connecté
    safeDisplay(loginLink,  "inline");
    safeDisplay(logoutLink, "none");
    safeDisplay(editionBar, "none");
    safeDisplay(filtersWrap, "flex");
    safeDisplay(edit, "none");
  }
}


const token = localStorage.getItem("token");
applyAuthUI(!!token);


if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    applyAuthUI(false);
    
    window.location.href = "index.html";
  });
}