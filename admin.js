import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    doc, 
    getDoc, 
    collection, 
    getDocs, 
    updateDoc, 
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { initAuthNav } from "./sync.js";

initAuthNav();

const statTotalUsers = document.getElementById("stat-total-users");
const statTotalChallenges = document.getElementById("stat-total-challenges");
const statAvgChallenges = document.getElementById("stat-avg-challenges");
const usersCountBadge = document.getElementById("users-count-badge");
const usersTableBody = document.getElementById("users-table-body");
const podiumContainer = document.getElementById("podium-container");

const pendingCountBadge = document.getElementById("pending-count-badge");
const pendingTableBody = document.getElementById("pending-table-body");

const exportExcelBtn = document.getElementById("export-excel-btn");
const exportPdfBtn = document.getElementById("export-pdf-btn");

const TOTAL_CHALLENGES = 24;
let globalUsersList = [];

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("Acceso denegado. Debés iniciar sesión.");
        window.location.href = "auth.html";
        return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists() || userDoc.data().role !== "admin") {
        alert("Acceso denegado. Tu cuenta no tiene permisos de administrador.");
        window.location.href = "index.html";
        return;
    }

    loadAdminData();
});

async function loadAdminData() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const approvedUsers = [];
        const pendingUsers = [];
        let totalResolved = 0;

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            data.id = docSnap.id;

            if (data.role === "admin" || data.approved === true) {
                approvedUsers.push(data);
                totalResolved += (data.stats?.total || 0);
            } else {
                pendingUsers.push(data);
            }
        });

        globalUsersList = approvedUsers;

        const totalUsers = approvedUsers.length;
        statTotalUsers.textContent = totalUsers;
        statTotalChallenges.textContent = totalResolved;
        statAvgChallenges.textContent = totalUsers > 0 ? (totalResolved / totalUsers).toFixed(1) : 0;
        usersCountBadge.textContent = `${totalUsers} activos`;

        renderPendingTable(pendingUsers);

        approvedUsers.sort((a, b) => {
            const totalA = a.stats?.total || 0;
            const totalB = b.stats?.total || 0;
            if (totalB !== totalA) {
                return totalB - totalA;
            }
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

        renderPodium(approvedUsers.slice(0, 3));
        renderTable(approvedUsers);

    } catch (error) {
        console.error("Error al cargar datos de admin:", error);
        usersTableBody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: #dc2626; padding: 20px;">Error al cargar los datos.</td></tr>`;
    }
}

function renderPendingTable(pendingList) {
    if (pendingCountBadge) {
        pendingCountBadge.textContent = `${pendingList.length} pendientes`;
    }

    if (!pendingTableBody) return;

    if (pendingList.length === 0) {
        pendingTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: #6b7280;">No hay solicitudes pendientes en este momento.</td></tr>`;
        return;
    }

    pendingTableBody.innerHTML = pendingList.map(u => {
        const date = u.createdAt ? new Date(u.createdAt).toLocaleDateString("es-AR") : "N/A";
        return `
            <tr>
                <td><strong>${u.displayName || "Estudiante"}</strong></td>
                <td style="color: #6b7280;">${u.email}</td>
                <td style="color: #6b7280;">${date}</td>
                <td style="text-align: center;">
                    <button onclick="window.approveUser('${u.id}')" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; margin-right: 6px;">
                        ✔ Aprobar
                    </button>
                    <button onclick="window.rejectUser('${u.id}')" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; cursor: pointer;">
                        ✖ Rechazar
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

window.approveUser = async (userId) => {
    if (!confirm("¿Aprobar el acceso de este alumno a DevLab?")) return;
    try {
        await updateDoc(doc(db, "users", userId), { approved: true });
        loadAdminData();
    } catch (err) {
        console.error("Error al aprobar:", err);
        alert("Error al aprobar usuario.");
    }
};

window.rejectUser = async (userId) => {
    if (!confirm("¿Rechazar y eliminar la solicitud de este alumno?")) return;
    try {
        await deleteDoc(doc(db, "users", userId));
        loadAdminData();
    } catch (err) {
        console.error("Error al rechazar:", err);
        alert("Error al eliminar solicitud.");
    }
};

function renderPodium(top3) {
    if (!top3 || top3.length === 0) {
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
                <h3>${second.displayName || "Estudiante"}</h3>
                <p class="podium-score">${second.stats?.total || 0} / ${TOTAL_CHALLENGES} resueltos</p>
                <div class="podium-pillar"></div>
            </div>
        `;
    } else {
        html += `<div class="podium-card" style="opacity: 0.3; border: 1px dashed #d1d5db;"><p style="margin: auto; padding: 20px 0; color:#9ca3af;">Vacante</p></div>`;
    }

    if (first) {
        html += `
            <div class="podium-card podium-first">
                <span class="podium-crown">👑</span>
                <span class="podium-badge">🥇 1° Puesto</span>
                <h3>${first.displayName || "Estudiante"}</h3>
                <p class="podium-score">${first.stats?.total || 0} / ${TOTAL_CHALLENGES} resueltos</p>
                <div class="podium-pillar"></div>
            </div>
        `;
    }

    if (third) {
        html += `
            <div class="podium-card podium-third">
                <span class="podium-badge">🥉 3° Puesto</span>
                <h3>${third.displayName || "Estudiante"}</h3>
                <p class="podium-score">${third.stats?.total || 0} / ${TOTAL_CHALLENGES} resueltos</p>
                <div class="podium-pillar"></div>
            </div>
        `;
    } else {
        html += `<div class="podium-card" style="opacity: 0.3; border: 1px dashed #d1d5db;"><p style="margin: auto; padding: 20px 0; color:#9ca3af;">Vacante</p></div>`;
    }

    podiumContainer.innerHTML = html;
}

function renderTable(users) {
    if (users.length === 0) {
        usersTableBody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 20px; color: #6b7280;">No hay alumnos registrados.</td></tr>`;
        return;
    }

    usersTableBody.innerHTML = users.map((u, index) => {
        const rank = index + 1;
        const html = u.stats?.html || 0;
        const css = u.stats?.css || 0;
        const js = u.stats?.js || 0;
        const git = u.stats?.git || 0;
        const total = u.stats?.total || 0;
        const percent = Math.min(100, Math.round((total / TOTAL_CHALLENGES) * 100));
        const date = u.createdAt ? new Date(u.createdAt).toLocaleDateString("es-AR") : "N/A";

        let rankBadge = `<strong>#${rank}</strong>`;
        if (rank === 1) rankBadge = `<span class="rank-medal gold">🥇 1</span>`;
        else if (rank === 2) rankBadge = `<span class="rank-medal silver">🥈 2</span>`;
        else if (rank === 3) rankBadge = `<span class="rank-medal bronze">🥉 3</span>`;

        return `
            <tr>
                <td style="text-align: center;">${rankBadge}</td>
                <td><strong>${u.displayName || "Estudiante"}</strong> ${u.role === "admin" ? '<span style="color:#6366f1; font-size:11px;">(Admin)</span>' : ''}</td>
                <td style="color: #6b7280;">${u.email}</td>
                <td style="color: #6b7280;">${date}</td>
                <td style="text-align: center;">${html}/6</td>
                <td style="text-align: center;">${css}/6</td>
                <td style="text-align: center;">${js}/6</td>
                <td style="text-align: center;">${git}/6</td>
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

// 1. EXPORTACIÓN A EXCEL (.XLSX)
if (exportExcelBtn) {
    exportExcelBtn.addEventListener("click", () => {
        if (globalUsersList.length === 0) {
            alert("No hay datos de alumnos para exportar.");
            return;
        }

        const excelData = globalUsersList.map((u, index) => ({
            "Posición": index + 1,
            "Nombre Completo": u.displayName || "Estudiante",
            "Email": u.email || "",
            "Rol": u.role || "alumno",
            "Fecha Registro": u.createdAt ? new Date(u.createdAt).toLocaleDateString("es-AR") : "N/A",
            "HTML (de 6)": u.stats?.html || 0,
            "CSS (de 6)": u.stats?.css || 0,
            "JS (de 6)": u.stats?.js || 0,
            "Git (de 6)": u.stats?.git || 0,
            "Total Resueltos (de 24)": u.stats?.total || 0,
            "% Progreso": `${Math.min(100, Math.round(((u.stats?.total || 0) / TOTAL_CHALLENGES) * 100))}%`
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Alumnos DevLab");

        const today = new Date().toISOString().split("T")[0];
        XLSX.writeFile(workbook, `Reporte_Alumnos_DevLab_${today}.xlsx`);
    });
}

// 2. EXPORTACIÓN A PDF (.PDF)
if (exportPdfBtn) {
    exportPdfBtn.addEventListener("click", () => {
        if (globalUsersList.length === 0) {
            alert("No hay datos de alumnos para exportar.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const docPDF = new jsPDF({ orientation: "landscape" });

        docPDF.setFontSize(18);
        docPDF.setTextColor(79, 70, 229);
        docPDF.text("DevLab - Reporte de Progreso de Alumnos", 14, 20);

        docPDF.setFontSize(10);
        docPDF.setTextColor(100, 116, 139);
        const today = new Date().toLocaleDateString("es-AR");
        docPDF.text(`Generado el: ${today} | Total alumnos activos: ${globalUsersList.length}`, 14, 27);

        const tableHeaders = [["Pos", "Alumno", "Email", "Registro", "HTML", "CSS", "JS", "Git", "Total", "Progreso"]];
        const tableData = globalUsersList.map((u, index) => [
            `#${index + 1}`,
            u.displayName || "Estudiante",
            u.email || "",
            u.createdAt ? new Date(u.createdAt).toLocaleDateString("es-AR") : "N/A",
            `${u.stats?.html || 0}/6`,
            `${u.stats?.css || 0}/6`,
            `${u.stats?.js || 0}/6`,
            `${u.stats?.git || 0}/6`,
            `${u.stats?.total || 0}/24`,
            `${Math.min(100, Math.round(((u.stats?.total || 0) / TOTAL_CHALLENGES) * 100))}%`
        ]);

        docPDF.autoTable({
            head: tableHeaders,
            body: tableData,
            startY: 34,
            theme: "grid",
            headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
            styles: { fontSize: 9, cellPadding: 3 }
        });

        docPDF.save(`Reporte_Alumnos_DevLab_${new Date().toISOString().split("T")[0]}.pdf`);
    });
}