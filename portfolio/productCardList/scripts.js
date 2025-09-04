  async function loadProducts() {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtR40KBo1NpHOPh9lOhY-vn9EDkPqYKSOtCaFVe-9RVsY36fONoQ63j2oGeOSaBe6TGkLFdOpR8KBw/pub?output=csv"; // use .csv exported google sheet

 // parses the product sheet to generate cards
    const response = await fetch(csvUrl);
    const csvText = await response.text();

    const rows = parseCSV(csvText);
    const products = rows.map(([id, name, description, categoryStr]) => ({
      id: id.trim(),
      name: name.trim().replace(/^"|"$/g, ''),
      description: description.trim().replace(/^"|"$/g, ''),
      categories: categoryStr.split('|').map(c => c.trim().replace(/^"|"$/g, ''))
    }));

    const container = document.getElementById('products');
    const categoryMap = {};

    // Create category cards
    products.forEach(product => {
      product.categories.forEach(category => {
        if (!categoryMap[category]) {
          const catCard = document.createElement('div');
          catCard.className = 'category';
          catCard.id = category;

          catCard.innerHTML = `
            <h2>${category}</h2>
            <div class="catHov">
              <p>Description of the type of products in this category.</p>
            </div>
          `;

          container.appendChild(catCard);
          categoryMap[category] = catCard;
        }
      });
    });

    // Adds product cards after each category
    products.forEach(product => {
      product.categories.forEach(category => {
        const productCard = document.createElement('div');
        productCard.className = 'product';
        productCard.id = product.id;

        productCard.innerHTML = `
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <img src="assets/${product.id}.jpg" />
        `;

        const categoryElement = categoryMap[category];

        // Insert the product after last product in that category group
        let next = categoryElement.nextSibling;
        while (next && next.classList && next.classList.contains('product')) {
          next = next.nextSibling;
        }
        container.insertBefore(productCard, next);
      });
    });
    
    createCategoryNav(categoryMap);

  }

  // CSV parser (handles quoted commas)
  function parseCSV(data) {
    const rows = [];
    let row = [], current = '', insideQuotes = false;

    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      const nextChar = data[i + 1];

      if (char === '"' && insideQuotes && nextChar === '"') {
        current += '"';
        i++; // skip the escaped quote
      } else if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        row.push(current);
        current = '';
      } else if ((char === '\n' || char === '\r') && !insideQuotes) {
        if (current || row.length) {
          row.push(current);
          rows.push(row);
          row = [];
          current = '';
        }
        if (char === '\r' && nextChar === '\n') i++; // skip \n in \r\n
      } else {
        current += char;
      }
    }

    if (current || row.length) {
      row.push(current);
      rows.push(row);
    }

    return rows;
  }

 // nav list
function createCategoryNav(categoryMap) {
  const nav = document.getElementById('categoryNav');
  const ul = document.createElement('ul');

  Object.keys(categoryMap).forEach(category => {
    const li = document.createElement('li');
    li.textContent = category;

    li.addEventListener('click', () => {
      document.getElementById(category)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });

    ul.appendChild(li);
  });

  nav.appendChild(ul);
}

  window.addEventListener('DOMContentLoaded', loadProducts);
