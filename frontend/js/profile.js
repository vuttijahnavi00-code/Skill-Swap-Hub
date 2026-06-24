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

async function loadProfile() {
  const token = redirectIfNotLoggedIn();
  if (!token) return;

  const res = await fetch(`${API}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    window.location.href = "login.html";
    return;
  }

  const user = await res.json();

  document.getElementById("name").innerText = user.name || "Profile";
  document.getElementById("email").innerText = user.email || "";
  document.getElementById("skills").value = (user.skills || []).join(", ");
  document.getElementById("bio").value = user.bio || "";
}

async function updateProfile() {
  const token = redirectIfNotLoggedIn();
  if (!token) return;

  const skills = document
    .getElementById("skills")
    .value.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const bio = document.getElementById("bio").value;

  const res = await fetch(`${API}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ skills, bio }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Profile update failed");
    return;
  }

  alert("Profile Updated");
}

loadProfile();
