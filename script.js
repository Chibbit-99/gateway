function fetchIP() {
  const statusEl = document.getElementById("status");
  const ipEl = document.getElementById("ip");

  statusEl.textContent = "Fetching…";
  ipEl.textContent = "—";

  try {
    // ipify supports CORS and HTTPS, so it works on GitHub Pages.
    const res = await fetch("https://api.ipify.org?format=json", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!data || typeof data.ip !== "string") {
      throw new Error("Unexpected response");
    }

    ipEl.textContent = data.ip;
    statusEl.textContent = "Done";
  } catch (err) {
    statusEl.textContent = "Could not fetch IP";
    ipEl.textContent = "Error";
    // Optional: log details for debugging
    console.error(err);
  }
}

document.getElementById("refresh").addEventListener("click", fetchIP);

const params = new URLSearchParams(window.location.search);

const id = params.get("id");
const redirect = params.get("redirect");

console.log(id, redirect);

fetchIP();
document.location.href = redirect
