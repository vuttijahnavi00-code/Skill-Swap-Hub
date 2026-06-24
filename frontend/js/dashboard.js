const API = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function redirectIfNotLoggedIn() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return null;
  }
  return token;
}

async function loadStats() {
  const token = redirectIfNotLoggedIn();
  if (!token) return;

  try {
    const res = await fetch(`${API}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }

    const data = await res.json();

    document.getElementById("userCount").textContent = data.totalUsers || 0;
    document.getElementById("requestCount").textContent = data.totalRequests || 0;
    document.getElementById("pendingCount").textContent = data.pendingRequests || 0;
  } catch (err) {
    console.log(err);
  }
}

async function loadUsers() {
  const token = redirectIfNotLoggedIn();
  if (!token) return;

  try {
    const res = await fetch(`${API}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }

    const users = await res.json();
    const container = document.getElementById("users");

    if (!Array.isArray(users) || users.length === 0) {
      container.innerHTML = "<p>No users found</p>";
      return;
    }

    container.innerHTML = users
      .map(
        (user) => `
                <div class="user-card">
                    <div class="avatar">
                        ${user.name?.charAt(0).toUpperCase() || "?"}
                    </div>

                    <h3>${user.name || "Unnamed"}</h3>

                    <p>
                        ${(user.skills || []).join(", ") || "No skills added"}
                    </p>

                    <button onclick="sendRequest('${user._id}')">
                        Request Swap
                    </button>
                </div>
            `
      )
      .join("");
  } catch (err) {
    console.log(err);
  }
}

async function sendRequest(toUserId) {
  const token = redirectIfNotLoggedIn();
  if (!token) return;

  const skillOffered = prompt("Your Skill");
  const skillWanted = prompt("Skill Wanted");

  if (!skillOffered || !skillWanted) return;

  await fetch(`${API}/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      toUserId,
      skillOffered,
      skillWanted,
    }),
  });

  alert("Request Sent Successfully");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

loadStats();
loadUsers();
