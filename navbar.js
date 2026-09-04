
import { auth, db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

function injectNavbarStyles() {
    if (document.getElementById("nav-custom-styles")) return;

    const style = document.createElement("style");
    style.id = "nav-custom-styles";
    style.innerHTML = `
        .nav-auth-container {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            margin-left: 14px;
        }

        /* Botón de Admin */
        .admin-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 700;
            color: #ffffff !important;
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95));
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 7px 14px;
            border-radius: 9px;
            transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
            position: relative;
            overflow: hidden;
        }

        .admin-nav-btn .admin-icon {
            display: inline-block;
            transition: transform 0.4s ease;
        }

        .admin-nav-btn:hover {
            color: #ffffff !important;
            border-color: #818cf8;
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
            background: linear-gradient(135deg, rgba(49, 46, 129, 0.9), rgba(30, 27, 75, 0.95));
        }

        .admin-nav-btn:hover .admin-icon {
            transform: rotate(90deg) scale(1.15);
        }

        /* Botón de Perfil de Usuario */
        .profile-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 700;
            color: #ffffff !important;
            background: linear-gradient(135deg, #6366f1, #4f46e5);
            padding: 7px 15px;
            border-radius: 9px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.25s ease;
            box-shadow: 0 2px 10px rgba(99, 102, 241, 0.25);
        }

        .profile-nav-btn:hover {
            color: #ffffff !important;
            background: linear-gradient(135deg, #4f46e5, #4338ca);
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(99, 102, 241, 0.4);
        }

        /* Botón de Acceder */
        .login-nav-btn {
            display: inline-flex;
            align-items: center;
            text-decoration: none;
            font-size: 13px;
            font-weight: 700;
            color: #ffffff !important;
            background: #6366f1;
            padding: 7px 16px;
            border-radius: 9px;
            transition: all 0.2s ease;
        }

        .login-nav-btn:hover {
            background: #4f46e5;
            transform: translateY(-1px);
        }
    `;
    document.head.appendChild(style);
}

export function initNavbarAuth() {
    injectNavbarStyles();

    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;

    let authContainer = document.getElementById("nav-auth-item");
    if (!authContainer) {
        authContainer = document.createElement("div");
        authContainer.id = "nav-auth-item";
        authContainer.className = "nav-auth-container";
        navLinks.appendChild(authContainer);
    }

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            let isAdmin = false;
            let displayName = user.displayName || user.email.split("@")[0] || "Estudiante";

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    if (data.displayName) displayName = data.displayName;
                    if (data.role === "admin") isAdmin = true;
                }
            } catch (err) {
                console.error("Error al validar rol de usuario en navbar:", err);
            }

            const adminButtonHtml = isAdmin ? `
                <a href="admin.html" class="admin-nav-btn" title="Ir al panel de administración">
                    <span class="admin-icon">⚙️</span>
                    <span>Panel Admin</span>
                </a>
            ` : "";

            authContainer.innerHTML = `
                ${adminButtonHtml}
                <a href="perfil.html" class="profile-nav-btn" title="Ver mi perfil y logros">
                    <span>👤</span>
                    <span>${displayName}</span>
                </a>
            `;
        } else {
            authContainer.innerHTML = `
                <a href="auth.html" class="login-nav-btn">
                    Acceder
                </a>
            `;
        }
    });
}


initNavbarAuth();