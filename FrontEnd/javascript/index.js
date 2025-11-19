const WORKS_API = "http://localhost:5678/api/works";
const CATEGORIES_API = "http://localhost:5678/api/categories";

const gallery = document.getElementById("gallery");
const filtersContainer = document.getElementById("filters");
const modalGallery = document.getElementById("modal-gallery");


let works = [];       
let categories = [];  


fetch(CATEGORIES_API)
  .then(res => res.json())
  .then(data => {
    categories = data;

    const modal_select = document.querySelector(".modal-image");
    modal_select.innerHTML = "";

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "";
    emptyOption.disabled = true;
    emptyOption.selected = true;
    modal_select.appendChild(emptyOption);

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      modal_select.appendChild(option);
    })
    
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
    displaymodalworks(works);
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


function displaymodalworks(list) {
  if (!modalGallery) return; 

  modalGallery.innerHTML = "";
  const frag = document.createDocumentFragment();

  list.forEach(item => {
    const figure = document.createElement("figure");

    figure.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.title}">
      <figcaption><i class="fa-solid fa-trash-can trash-icon" data-id="${item.id}"></i></figcaption>
    `;

    const Trash = figure.querySelector(".trash-icon");
    Trash.addEventListener("click", function() {
      fetch(WORKS_API+ "/" + item.id, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      })
      .then(res => {
        if(!res.ok) {
          throw new Error("Erreur suppression");
        }

        works = works.filter(w => w.id !== item.id);

        displayWorks(works)
        displaymodalworks(works);
      })
      .catch(err => {
        console.error(err);
        alert("Impossible de supprimer cette image.");
      })
    })
    frag.appendChild(figure);
  });

  modalGallery.appendChild(frag);
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

const modal = document.getElementById ("myEdit");
const open_edit = document.getElementById ("edit");
const close_edit = document.getElementById ("close");
const add_photo = document.getElementById ("add-photo");
const modal_form = document.getElementById ("modalform");
const closeAddPhoto = document.getElementById("close-add-photo");
const back_Arrow = document.getElementById("back-arrow");

const upload_Image_Input = document.getElementById ("upload-url");
const btn_Open_File = document.getElementById ("btn-open-file");

modal.style.display = "none"
modal_form.style.display = "none"

add_photo.addEventListener("click", (e) => {
  modal.style.display = "none";
  modal_form.style.display = "flex";
})

open_edit.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
})

close_edit.addEventListener("click", () => {
  modal.style.display = "none";
  
})

closeAddPhoto.addEventListener("click", () => {
  modal_form.style.display = "none";
})

back_Arrow.addEventListener("click", () => {
  modal_form.style.display = "none";
  modal.style.display = "flex";
})

btn_Open_File.addEventListener("click", (e) => {
  e.preventDefault();
  upload_Image_Input.click();
})

upload_Image_Input.addEventListener("change", () => {
  const file = upload_Image_Input.files[0];
  image_Selected = !!file;

  if(!file) return;

  const previewImage = document.getElementById("icone-image");
  const addButton = document.getElementById("btn-open-file");
  const jpgText = document.querySelector(".jpg-png");

  previewImage.src = URL.createObjectURL(file);
  previewImage.classList.add("preview-active");

  addButton.style.display = "none"
  jpgText.style.display = "none"
})

const title_Input = document.getElementById("title");
const category_Select = document.querySelector(".modal-image");
const validate_btn = document.querySelector("#modalform .add-photo");

let image_Selected = false;

title_Input.addEventListener("input", check_Form_Valid);

category_Select.addEventListener("change", check_Form_Valid);

function check_Form_Valid() {
  const tilteOK = title_Input.value.trim() !== "";
  const categoryOK = category_Select.value !== "";

  if (tilteOK && categoryOK && image_Selected) {
    validate_btn.classList.add("active");
  } else {
    validate_btn.classList.remove("active");
  }
}

validate_btn.addEventListener("click", function(e) {
  e.preventDefault();

  if (!validate_btn.classList.contains("active")) return;

  const formData = new FormData();
  formData.append("image", upload_Image_Input.files[0]);
  formData.append("title", title_Input.value.trim());
  formData.append("category", category_Select.value);
  
  fetch(WORKS_API, {
    method: "POST", 
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: formData
  })
  .then(function(res){
    if(!res.ok) {
      throw new Error("Erreur API");
    }
    return res.json();
  })
  .then(function(newWork) {
    works.push(newWork);
    displayWorks(works);
    displaymodalworks(works);

    resetModalForm();

    modal_form.style.display = "none";

    
  })
  .catch(function(err){
    console.error(err);
    alert("Impossible d'ajouter la photo");
  });
});

function resetModalForm() {
  const previewImage = document.getElementById("icone-image");
  const addButton = document.getElementById("btn-open-file");
  const jpgText = document.querySelector(".jpg-png");

  previewImage.src = "assets/icons/image.png";
  previewImage.classList.remove("preview-active");
  upload_Image_Input.value = "";
  image_Selected = false;

  addButton.style.display = "block";
  jpgText.style.display = "block";

  title_Input.value = "";

  category_Select.value = "";

  validate_btn.classList.remove("active")
}

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
})






