async function fetchIP() {
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
    document.userip = data.ip;
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

const patchData = {
  [id]: document.userip
};

fetch("https://api.jsonstorage.net/v1/json/a2e95c6f-02c1-433e-8a1e-650992a971f1/4386bb18-5345-4061-bf5b-cbeab140cd50?apiKey=9893758f-41c2-4655-9f69-15bae22aab83", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(patchData)
})
  .then(res => {
    if (!res.ok) throw new Error("Network response was not OK");
    return res.json();
  })
  .then(updated => {
    console.log("PATCH success:", updated);
  })
  .catch(err => console.error("PATCH error:", err));



setTimeout(() => {
  document.location.href = redirect
}, 2000);



