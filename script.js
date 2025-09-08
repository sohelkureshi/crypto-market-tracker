const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
let cryptoData = [];
let currentSort = null; // Track current sort state: "marketCap", "percentChange", or null

// Fetch using async/await
async function fetchCryptoData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    cryptoData = data;
    currentSort = null; // reset sort state on new data load
    renderTable(cryptoData);
  } catch (error) {
    console.error("Error fetching crypto data:", error);
  }
}

// // Fetch using .then (alternative method)    // keep for evaluation purpose.
// function fetchCryptoDataThen() {
//   fetch(API_URL)
//     .then(res => res.json())
//     .then(data => {
//       cryptoData = data;
//       currentSort = null;
//       renderTable(cryptoData);
//     })
//     .catch(err => console.error('Error:', err));
// }

// Table renderer
function renderTable(dataArray) {
  const tableBody = document.querySelector("#cryptoTable tbody");
  tableBody.innerHTML = "";
  dataArray.forEach(coin => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${coin.image}" alt="${coin.name}"></td>
      <td>${coin.name}</td>
      <td>${coin.symbol.toUpperCase()}</td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td style="color:${coin.price_change_percentage_24h >= 0 ? '#31d281' : '#e03a3a'};">
        ${coin.price_change_percentage_24h.toFixed(2)}%
      </td>
      <td>$${coin.total_volume.toLocaleString()}</td>
      <td>$${coin.market_cap.toLocaleString()}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Search logic with alert for empty input and reset on input clear
function searchCrypto() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  if (query === "") {
    alert("Please write something to search.");
    return;
  }
  const filtered = cryptoData.filter(coin => 
    coin.name.toLowerCase().includes(query) ||
    coin.symbol.toLowerCase().includes(query)
  );
  currentSort = null; // Reset sorting when searching
  renderTable(filtered);
}

// Reset table automatically when input cleared
document.getElementById("searchInput").addEventListener("input", (e) => {
  if (e.target.value.trim() === "") {
    currentSort = null; // Reset sorting when resetting table
    renderTable(cryptoData);
  }
});

// Sort by Market Cap with alert if already sorted by market cap
function sortByMarketCap() {
  if (currentSort === "marketCap") {
    alert("Already sorted by Market Cap.");
    return;
  }
  const sorted = [...cryptoData].sort((a, b) => b.market_cap - a.market_cap);
  currentSort = "marketCap";
  renderTable(sorted);
}

// Sort by % Change with alert if already sorted by % Change
function sortByChange() {
  if (currentSort === "percentChange") {
    alert("Already sorted by % Change.");
    return;
  }
  const sorted = [...cryptoData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  currentSort = "percentChange";
  renderTable(sorted);
}

// Event listeners
document.getElementById("searchBtn").addEventListener("click", searchCrypto);
document.getElementById("sortMarketCapBtn").addEventListener("click", sortByMarketCap);
document.getElementById("sortChangeBtn").addEventListener("click", sortByChange);

// Initial fetch (choose either method)
fetchCryptoData(); // or fetchCryptoDataThen();
