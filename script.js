const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const productsContainer = document.getElementById("products");
const footer = document.getElementById("footer")

// Load products from Google Sheets
async function loadProducts() {
  try {
    const sheetID = "19qt542h6vLmYpg5sjns1r17TbTz_uYTuy0QH1doqN3A";
    const sheetGID = "0";
    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&gid=${sheetGID}`;
    
    const response = await fetch(url);
    const text = await response.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const rows = json.table.rows;

    rows.forEach((row, i) => {
      //if (i === 0) return; // skip header row

      //const [title, price, seller, category, rawImageURL, convertedImageURL, whatsapp] = row.c.map(c => c ? c.v : "");
      const cells = row.c.map(c => (c ? c.v : ""));
      const title = cells[0];
      const price = cells[1];
      const seller = cells[2];
      const category = cells[3];
      const rawImageURL = cells[4];
      const convertedImageURL = cells[5];
      const whatsapp = cells[6];

      const img = convertedImageURL;

      console.log("Image being used:", img);

      const card = document.createElement("div");
      card.className = "card";
      card.dataset.category = category.toLowerCase();

      card.innerHTML = `
        <div class="card-image-container">
          <img src="${img}" alt="${title}">
        </div>
        <div class="card-content">
          <h3>${title}</h3>
          <p class="price">KES ${price}</p>
          <p>Seller: ${seller}</p>
        </div>
        <a href="https://wa.me/${whatsapp}" target="_blank">
          <button>Contact Seller 👋</button>
        </a>
      `;
      productsContainer.appendChild(card);
    
    });

    setTimeout(() => {
        loading.classList.add("fade-out");
        productsContainer.classList.add("show");
      }, 800);

    setTimeout(() => {
      loading.style.display = "none";
    }, 800);
    
    setTimeout(() => {
      footer.style.display = "block";
    }, 900);

    shuffleCards();     // shuffle after loading
    initFiltering();    // enable search + filter after cards exist
    

  } catch (err) {
    console.error("Error loading products", err);
  }
}

// Shuffle cards
function shuffleCards() {
  const cards = Array.from(productsContainer.children);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  cards.forEach(card => productsContainer.appendChild(card));
}

// Filtering
function initFiltering() {
  function filterProducts() {
    const searchText = searchInput.value.toLowerCase();
    const category = categorySelect.value.toLowerCase();
    const products = productsContainer.querySelectorAll(".card");

    products.forEach(product => {
      const title = product.querySelector("h3").textContent.toLowerCase();
      const matchesSearch = title.includes(searchText);
      const matchesCategory =
        category === "all" || product.dataset.category === category;

      product.style.display =
        matchesSearch && matchesCategory ? "block" : "none";
    });
  }

  searchInput.addEventListener("input", filterProducts);
  categorySelect.addEventListener("change", filterProducts);
}

// Auto year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Start

loadProducts();
