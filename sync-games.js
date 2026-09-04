
import { auth, db } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const ACHIEVEMENTS_CATALOG = [
    {
        id: "lander_ace",
        gameId: "flexbox-lander",
        title: "Piloto Estelar",
        icon: "🛸",
        desc: "Superaste los 90 pts en Flexbox Lander.",
        condition: (data) => Number(data.score) >= 90
    },
    {
        id: "speed_demon",
        gameId: "flexbox-lander",
        title: "Reflejos de Luz",
        icon: "⚡",
        desc: "Alcanzaste una velocidad de 2.5x o más.",
        condition: (data) => Number(data.velocity) >= 2.5
    },
    {
        id: "git_hero",
        gameId: "git-bomb",
        title: "DevOps Legend",
        icon: "🛡️",
        desc: "Salvaste el servidor con más de 15 segundos de sobra.",
        condition: (data) => Number(data.score) >= 175
    },
    {
        id: "tag_master",
        gameId: "tag-invaders",
        title: "Exterminador HTML",
        icon: "👾",
        desc: "Superaste los 150 pts destruyendo etiquetas.",
        condition: (data) => Number(data.score) >= 150
    },
    {
        id: "combo_king",
        gameId: "tag-invaders",
        title: "Rey del Combo",
        icon: "🔥",
        desc: "Alcanzaste una racha combo de x10.",
        condition: (data) => Number(data.combo) >= 10
    },
    {
        id: "speedrun_pro",
        gameId: "speedrun",
        title: "Velocista Frontend",
        icon: "⚡",
        desc: "Superaste los 100 pts en Speedrun Frontend.",
        condition: (data) => Number(data.score) >= 100
    },
    {
        id: "bug_hunter",
        gameId: "inspector",
        title: "Cazador de Bugs",
        icon: "🐞",
        desc: "Encontraste todos los errores sin fallar en Inspector.",
        condition: (data) => Number(data.score) >= 100
    }
];

function showAchievementToast(badge) {
    let container = document.getElementById("achievement-toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "achievement-toast-container";
        container.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 12px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.style.cssText = `
        background: linear-gradient(135deg, #1e1b4b, #0f172a);
        border: 2px solid #f59e0b;
        border-radius: 14px;
        padding: 14px 20px;
        display: flex;
        align-items: center;
        gap: 14px;
        color: #ffffff;
        box-shadow: 0 10px 30px rgba(245, 158, 11, 0.35);
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        font-family: system-ui, -apple-system, sans-serif;
    `;

    toast.innerHTML = `
        <div style="font-size: 32px; background: rgba(245, 158, 11, 0.15); width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
            ${badge.icon}
        </div>
        <div>
            <div style="font-size: 11px; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px;">
                ¡LOGRO DESBLOQUEADO!
            </div>
            <div style="font-size: 15px; font-weight: 800; margin: 2px 0;">${badge.title}</div>
            <div style="font-size: 12px; color: #94a3b8;">${badge.desc}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => { toast.style.transform = "translateX(0)"; }, 50);
    setTimeout(() => {
        toast.style.transform = "translateX(130%)";
        setTimeout(() => toast.remove(), 400);
    }, 4500);
}

async function checkAndGrantAchievements(userId, gameId, gameData) {
    const candidates = ACHIEVEMENTS_CATALOG.filter(a => a.gameId === gameId && a.condition(gameData));

    for (const badge of candidates) {
        try {
            const badgeRef = doc(db, "users", userId, "achievements", badge.id);
            const badgeSnap = await getDoc(badgeRef);

            if (!badgeSnap.exists()) {
                await setDoc(badgeRef, {
                    id: badge.id,
                    title: badge.title,
                    icon: badge.icon,
                    desc: badge.desc,
                    gameId: badge.gameId,
                    unlockedAt: serverTimestamp()
                });

                showAchievementToast(badge);
            }
        } catch (error) {
            console.error(`Error al otorgar insignia ${badge.id}:`, error);
        }
    }
}

export const saveGameStats = async (gameId, gameData) => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            unsubscribe();

            if (!user) {
                console.warn("Modo Invitado: Puntuación no guardada.");
                return resolve(false);
            }

            try {
                const displayName = user.displayName || user.email.split("@")[0] || "DevPlayer";
                const currentScore = Number(gameData.score) || 0;

               
                const userGameRef = doc(db, "users", user.uid, "game_stats", gameId);
                const userDocSnap = await getDoc(userGameRef);
                
                let isNewMaxScore = false;

                if (userDocSnap.exists()) {
                    const currentStats = userDocSnap.data();
                    const prevMax = Number(currentStats.max_score) || 0;
                    isNewMaxScore = currentScore > prevMax;

                    const updateData = {
                        total_games: increment(1),
                        last_played: serverTimestamp()
                    };

                    if (isNewMaxScore) {
                        updateData.max_score = currentScore;
                        if (gameData.velocity) updateData.max_velocity = gameData.velocity;
                    }

                    await updateDoc(userGameRef, updateData);
                } else {
                    isNewMaxScore = true;
                    await setDoc(userGameRef, {
                        max_score: currentScore,
                        max_velocity: gameData.velocity || 1.0,
                        total_games: 1,
                        last_played: serverTimestamp()
                    });
                }

               
               
if (isNewMaxScore) {
    const leaderboardDocRef = doc(db, `leaderboard_${gameId}`, user.uid);
    await setDoc(leaderboardDocRef, {
        userId: user.uid,
        displayName: displayName,
        photoURL: user.photoURL || null,
        score: currentScore,
        velocity: gameData.velocity !== undefined ? gameData.velocity : null,
        updatedAt: serverTimestamp()
    }, { merge: true });
}

               
                await checkAndGrantAchievements(user.uid, gameId, gameData);

                resolve({ isNewMaxScore });

            } catch (error) {
                console.error("Error al sincronizar partida:", error);
                reject(error);
            }
        });
    });
};