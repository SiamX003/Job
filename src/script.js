/*
const sortBtns = document.querySelectorAll(".job-id > *");
const sortItems = document.querySelectorAll(".jobs-container > *");
sortBtns.forEach((btn) =>{
    btn.addEventListener('click', ()=>{
        sortBtns.forEach((btn)=>btn.classList.remove("active"));
        btn.classList.add("active");
        const targetData = btn.getAttribute('data-target');
        sortItems.forEach((item) => {
            item.classList.add("delete");
            if(item.getAttribute("data-item") == targetData || targetData=="all"){
                item.classList.remove('delete');
            }
        } );
    });
});
*/

// ---- Job Filter ----
const filterBtns = document.querySelectorAll(".job-id li");
const jobItems = document.querySelectorAll(".jobs-container .jList");
const searchBar = document.getElementById("searchBar");

let activeFilter = "all"; // Default filter

// Handle category filter clicks
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active class from all
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    activeFilter = btn.getAttribute("data-target");
    filterJobs();
  });
});

// Handle search input
if (searchBar) {
  searchBar.addEventListener("keyup", () => {
    filterJobs();
  });
}

// Core filter function
function filterJobs() {
  const searchText = searchBar ? searchBar.value.toLowerCase() : "";

  jobItems.forEach(item => {
    const matchesCategory =
      activeFilter === "all" || item.getAttribute("data-item") === activeFilter;

    const jobTitle = item.querySelector("h3").textContent.toLowerCase();
    const jobType = item.querySelector("span.key").textContent.toLowerCase();
    const company = item.querySelector("img").alt.toLowerCase();

    const matchesSearch =
      jobTitle.includes(searchText) ||
      jobType.includes(searchText) ||
      company.includes(searchText);

    if (matchesCategory && matchesSearch) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

// ---- Join Modal ----
const joinBtn = document.getElementById("w-btn");
const modal = document.getElementById("joinModal");
const closeBtn = document.querySelector(".modal .close");

if (joinBtn && modal && closeBtn) {
  joinBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}
