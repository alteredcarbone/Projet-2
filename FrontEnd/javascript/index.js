   const API_URL = "http://localhost:5678/api/works";
   const gallery = document.getElementById("gallery");

  fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    gallery.innerHTML = ""; 

    data.forEach(item => {
      const figure = document.createElement("figure");

      figure.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.title}">
        <figcaption>${item.title}</figcaption>
      `;

      gallery.appendChild(figure);
    });
  })
  .catch(err => {
    console.error("Erreur :", err);
    gallery.innerHTML = "<p>Impossible de charger les images.</p>";
  });

