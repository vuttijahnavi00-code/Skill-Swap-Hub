const API = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

function redirectIfNotLoggedIn() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return null;
  }
  return token;
}

async function loadRequests() {
  const token = redirectIfNotLoggedIn();
  if (!token) return;

  const res = await fetch(`${API}/requests/received`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    window.location.href = "login.html";
    return;
  }

  const data = await res.json();
  const container = document.getElementById("requests");

  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = "<p>No requests yet.</p>";
    return;
  }

  container.innerHTML = data
    .map(
      (r) => `
    <div class="card">
      <h3>From: ${r.fromUser?.name || "Unknown"}</h3>
      <p>Offers: ${r.skillOffered}</p>
      <p>Wants: ${r.skillWanted}</p>

      <button onclick="update('${r._id}', 'accepted')">Accept</button>
      <button onclick="update('${r._id}', 'rejected')">Reject</button>
    </div>
  `
    )
    .join("");
}

async function update(id, status) {
  const token = redirectIfNotLoggedIn();
  if (!token) return;

  await fetch(`${API}/requests/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  loadRequests();
}

loadRequests();
