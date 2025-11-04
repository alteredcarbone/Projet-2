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