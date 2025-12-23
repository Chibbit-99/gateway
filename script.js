async function fetchIPAndPatch() {
  const statusEl = document.getElementById("status");
  const ipEl = document.getElementById("ip");

  statusEl.textContent = "Fetching…";
  ipEl.textContent = "—";

  try {
    // Fetch the IP
    const res = await fetch("https://api.ipify.org?format=json", {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data || typeof data.ip !== "string") throw new Error("Unexpected response");

    ipEl.textContent = data.ip;
    document.userip = data.ip;
    statusEl.textContent = "Done";

    // Now that IP is ready, PATCH it
    const patchData = {
      [id]: document.userip
    };

    const patchRes = await fetch(
      "https://api.jsonstorage.net/v1/json/a2e95c6f-02c1-433e-8a1e-650992a971f1/4386bb18-5345-4061-bf5b-cbeab140cd50?apiKey=9893758f-41c2-4655-9f69-15bae22aab83",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchData)
      }
    );

    if (!patchRes.ok) throw new Error("PATCH network response not OK");

    const updated = await patchRes.json();
    console.log("PATCH success:", updated);

  } catch (err) {
    statusEl.textContent = "Could not fetch IP / update JSON";
    ipEl.textContent = "Error";
    console.error(err);
  }
}

// Event listener
document.getElementById("refresh").addEventListener("click", fetchIPAndPatch);

// Parse URL params
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const redirect = params.get("redirect");

console.log(id, redirect);

// Run once on page load
fetchIPAndPatch();

// Redirect after 20 seconds
setTimeout(() => {
  document.location.href = redirect;
}, 20000);
