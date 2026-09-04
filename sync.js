
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";




export function initAuthNav() {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;

    onAuthStateChanged(auth, async (user) => {
        const existingAuthLink = document.getElementById("nav-auth-item");
        if (existingAuthLink) existingAuthLink.remove();

        const authContainer = document.createElement("div");
        authContainer.id = "nav-auth-item";
        authContainer.style.display = "flex";
        authContainer.style.alignItems = "center";
        authContainer.style.gap = "16px";
        authContainer.style.marginLeft = "10px";
        authContainer.style.paddingLeft = "20px";
        authContainer.style.borderLeft = "1px solid #e5e7eb";

        if (user) {
            let isAdmin = false;
            let displayName = user.email.split("@")[0];

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.displayName) displayName = userData.displayName;
                    if (userData.role === "admin") isAdmin = true;
                }
            } catch (err) {
                console.error("Error al obtener datos de usuario:", err);
            }

            const adminHtml = isAdmin ? `
                <a href="admin.html" style="color: #6366f1; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; line-height: 1;">
                    ⚡ Panel Admin
                </a>
            ` : "";

            authContainer.innerHTML = `
                ${adminHtml}
                <div style="display: inline-flex; align-items: center; gap: 6px; color: #4b5563; font-size: 13px; font-weight: 600; line-height: 1;">
                    <span style="font-size: 15px; display: flex; align-items: center;">👤</span>
                    <span>${displayName}</span>
                </div>
                <button id="logout-btn" style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; color: #475569; cursor: pointer; display: inline-flex; align-items: center; line-height: 1; transition: all 0.2s ease;">
                    Salir
                </button>
            `;

            navLinks.appendChild(authContainer);

            const logoutBtn = document.getElementById("logout-btn");
            if (logoutBtn) {
                logoutBtn.addEventListener("mouseover", () => {
                    logoutBtn.style.background = "#f1f5f9";
                    logoutBtn.style.borderColor = "#cbd5e1";
                });
                logoutBtn.addEventListener("mouseout", () => {
                    logoutBtn.style.background = "#f8fafc";
                    logoutBtn.style.borderColor = "#e2e8f0";
                });
                logoutBtn.addEventListener("click", async () => {
                    await signOut(auth);
                    window.location.reload();
                });
            }
        } else {
            authContainer.innerHTML = `
                <a href="auth.html" class="hero-button" style="padding: 8px 16px; font-size: 13px; margin: 0; line-height: 1; display: inline-flex; align-items: center;">Acceder</a>
            `;
            navLinks.appendChild(authContainer);
        }
    });
}




export async function saveChallengeCompletion(challengeKey, category) {
    localStorage.setItem(challengeKey, "completed");

    const user = auth.currentUser;
    if (user) {
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                const completedList = data.completedChallenges || [];

                if (!completedList.includes(challengeKey)) {
                    const currentStats = data.stats || { html: 0, css: 0, js: 0, git: 0, total: 0 };
                    const updatedStats = {
                        ...currentStats,
                        [category]: (currentStats[category] || 0) + 1,
                        total: (currentStats.total || 0) + 1
                    };

                    await updateDoc(userRef, {
                        completedChallenges: arrayUnion(challengeKey),
                        stats: updatedStats
                    });
                }
            }
        } catch (error) {
            console.error("Error al sincronizar con Firestore:", error);
        }
    }
}