// Parse URL parameters
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const redirect = params.get("redirect");

if (!id) {
  console.error("No ID provided in URL. Add ?id=yourKey");
}

const statusEl = document.getElementById("status");
const ipEl = document.getElementById("ip");

const jsonUrl = "https://api.jsonstorage.net/v1/json/a2e95c6f-02c1-433e-8a1e-650992a971f1/4386bb18-5345-4061-bf5b-cbeab140cd50";
const apiKey = "9893758f-41c2-4655-9f69-15bae22aab83";

// Main function: fetch IP and PATCH
async function fetchIPAndPatch() {
  statusEl.textContent = "Fetching…";
  ipEl.textContent = "—";

  try {
    // 1️⃣ Fetch IP
    const res = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const ip = data.ip;
    if (!ip) throw new Error("IP not found");

    ipEl.textContent = ip;
    document.userip = ip;
    statusEl.textContent = "Got IP";

    // 2️⃣ PATCH JSONStorage.net
    if (!id) throw new Error("No ID provided for JSON key");

    const patchData = { [id]: ip };
    const patchRes = await fetch(`${jsonUrl}?apiKey=${apiKey}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patchData)
    });

    if (!patchRes.ok) throw new Error("PATCH failed");

    console.log("PATCH sent:", patchData);

    // 3️⃣ Confirm update by GET
    const currentData = await fetch(jsonUrl).then(r => r.json());
    console.log("Stored JSON now:", currentData);

    statusEl.textContent = "IP saved";

  } catch (err) {
    statusEl.textContent = "Error";
    ipEl.textContent = "—";
    console.error("Error fetching or patching:", err);
  }
}

// Event listener for refresh button
document.getElementById("refresh").addEventListener("click", fetchIPAndPatch);

// Run once on page load
fetchIPAndPatch();

// Redirect after 20 seconds
setTimeout(() => {
  if (redirect) {
    document.location.href = redirect;
  }
}, 20000);
