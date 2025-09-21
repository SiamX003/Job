
const categories = Array.from(jCategory);

document.getElementById("searchBar").addEventListener("keyup", (e) => {
  const searchData = e.target.value.toLowerCase();


  const filterData = categories.filter((item) =>
    item.title.toLowerCase().includes(searchData)
  );

  displayItems(filterData);
});

const displayItems = (items) => {
  const rootElement = document.getElementById("root");
  rootElement.innerHTML = "";

  items.forEach((item) => {
    const { image, title, rate, av } = item;
    const jlist = document.createElement("div");
    jlist.className = "jList";
    jlist.innerHTML = `
      <img src="${image}" alt="">
      <h3>${title}</h3>
      <p>${rate}</p>
      <span class="key">${av}</span>
    `;
    rootElement.appendChild(jlist);

    jlist.addEventListener("click", () => {
      window.location.href = "job-details.js";
    }
    );
  });
};

displayItems(categories);
