import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { initAuthNav } from "./sync.js";

initAuthNav();

const TOTAL_CHALLENGES = 24;
const podiumContainer = document.getElementById("podium-container");
const rankingTableBody = document.getElementById("ranking-table-body");
const rankingTotalBadge = document.getElementById("ranking-total-badge");

async function loadRanking() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = [];

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.approved === true || data.role === "admin") {
                users.push({
                    displayName: data.displayName || "Estudiante",
                    email: data.email || "",
                    stats: data.stats || { html: 0, css: 0, js: 0, git: 0, total: 0 },
                    createdAt: data.createdAt || ""
                });
            }
        });

        users.sort((a, b) => {
            const totalA = a.stats?.total || 0;
            const totalB = b.stats?.total || 0;
            if (totalB !== totalA) {
                return totalB - totalA;
            }
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

        rankingTotalBadge.textContent = `${users.length} alumnos`;

        renderPodium(users.slice(0, 3));
        renderTable(users);

    } catch (error) {
        console.error("Error al cargar ranking:", error);
        rankingTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #dc2626; padding: 20px;">Error al obtener la tabla de posiciones.</td></tr>`;
    }
}

function renderPodium(top3) {
    if (top3.length === 0) {
        podiumContainer.innerHTML = `<p style="color: #6b7280; text-align: center; grid-column: 1/-1;">Aún no hay alumnos con progreso.</p>`;
        return;
    }

    const first = top3[0];
    const second = top3[1];
    const third = top3[2];

    let html = "";

    if (second) {
        html += `
            <div class="podium-card podium-second">
                <span class="podium-badge">🥈 2° Puesto</span>
                <h3>${second.displayName}</h3>
                <p class="podium-score">${second.stats?.total || 0} / ${TOTAL_CHALLENGES} desafíos</p>
                <div class="podium-pillar"></div>
            </div>
        `;
    } else {
        html += `<div class="podium-card podium-empty"></div>`;
    }

    if (first) {
        html += `
            <div class="podium-card podium-first">
                <span class="podium-crown">👑</span>
                <span class="podium-badge">🥇 1° Puesto</span>
                <h3>${first.displayName}</h3>
                <p class="podium-score">${first.stats?.total || 0} / ${TOTAL_CHALLENGES} desafíos</p>
                <div class="podium-pillar"></div>
            </div>
        `;
    }

    if (third) {
        html += `
            <div class="podium-card podium-third">
                <span class="podium-badge">🥉 3° Puesto</span>
                <h3>${third.displayName}</h3>
                <p class="podium-score">${third.stats?.total || 0} / ${TOTAL_CHALLENGES} desafíos</p>
                <div class="podium-pillar"></div>
            </div>
        `;
    } else {
        html += `<div class="podium-card podium-empty"></div>`;
    }

    podiumContainer.innerHTML = html;
}

function renderTable(users) {
    if (users.length === 0) {
        rankingTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px; color: #6b7280;">No hay alumnos registrados.</td></tr>`;
        return;
    }

    rankingTableBody.innerHTML = users.map((u, index) => {
        const rank = index + 1;
        const total = u.stats?.total || 0;
        const percent = Math.min(100, Math.round((total / TOTAL_CHALLENGES) * 100));

        let rankBadge = `<strong>#${rank}</strong>`;
        if (rank === 1) rankBadge = `<span class="rank-medal gold">🥇 1</span>`;
        else if (rank === 2) rankBadge = `<span class="rank-medal silver">🥈 2</span>`;
        else if (rank === 3) rankBadge = `<span class="rank-medal bronze">🥉 3</span>`;

        return `
            <tr>
                <td style="text-align: center;">${rankBadge}</td>
                <td><strong>${u.displayName}</strong></td>
                <td style="text-align: center;">${u.stats?.html || 0}/6</td>
                <td style="text-align: center;">${u.stats?.css || 0}/6</td>
                <td style="text-align: center;">${u.stats?.js || 0}/6</td>
                <td style="text-align: center;">${u.stats?.git || 0}/6</td>
                <td style="text-align: center; font-weight: 700; color: #6366f1;">${total}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div class="progress" style="flex: 1; margin: 0; height: 6px;">
                            <div class="progress-bar" style="width: ${percent}%;"></div>
                        </div>
                        <span style="font-size: 12px; font-weight: bold; width: 35px;">${percent}%</span>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

loadRanking();