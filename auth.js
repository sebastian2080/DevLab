
import { auth, db } from "./firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const authForm = document.getElementById("auth-form");
const nameGroup = document.getElementById("name-field-group");
const userNameInput = document.getElementById("user-name");
const emailInput = document.getElementById("user-email");
const passwordInput = document.getElementById("user-password");
const submitBtn = document.getElementById("auth-submit-btn");
const errorMsg = document.getElementById("auth-error-msg");
const toggleBtn = document.getElementById("toggle-auth-mode");
const authTitle = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const toggleText = document.getElementById("toggle-text");

let isSignUpMode = false;

toggleBtn.addEventListener("click", () => {
    isSignUpMode = !isSignUpMode;
    errorMsg.textContent = "";

    if (isSignUpMode) {
        authTitle.textContent = "Crear cuenta";
        authSubtitle.textContent = "Registrate para solicitar acceso a DevLab.";
        nameGroup.style.display = "block";
        submitBtn.textContent = "Solicitar registro";
        toggleText.textContent = "¿Ya tenés cuenta?";
        toggleBtn.textContent = "Iniciá sesión acá";
    } else {
        authTitle.textContent = "Iniciar sesión";
        authSubtitle.textContent = "Ingresá tus credenciales para acceder a DevLab.";
        nameGroup.style.display = "none";
        submitBtn.textContent = "Ingresar";
        toggleText.textContent = "¿No tenés cuenta?";
        toggleBtn.textContent = "Registrate acá";
    }
});

authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const name = userNameInput.value.trim();

    try {
        if (isSignUpMode) {
           
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (name) {
                await updateProfile(user, { displayName: name });
            }

           
            await setDoc(doc(db, "users", user.uid), {
                displayName: name || "Estudiante",
                email: email,
                role: "alumno",
                approved: false,
                createdAt: new Date().toISOString(),
                stats: { html: 0, css: 0, js: 0, total: 0 }
            });

           
            await signOut(auth);
            alert("¡Solicitud enviada! Tu cuenta está en revisión y debe ser aprobada por el administrador.");
            toggleBtn.click();
            return;

        } else {
           
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

           
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();

               
                if (userData.role !== "admin" && userData.approved !== true) {
                    await signOut(auth);
                    errorMsg.textContent = "Tu cuenta aún no fue aprobada por el administrador.";
                    return;
                }
            }

            window.location.href = "index.html";
        }

    } catch (error) {
        console.error("Error en autenticación:", error);
        switch (error.code) {
            case "auth/invalid-credential":
            case "auth/wrong-password":
            case "auth/user-not-found":
                errorMsg.textContent = "Correo o contraseña incorrectos.";
                break;
            case "auth/email-already-in-use":
                errorMsg.textContent = "Este correo ya está registrado. Iniciá sesión.";
                break;
            case "auth/weak-password":
                errorMsg.textContent = "La contraseña debe tener al menos 6 caracteres.";
                break;
            default:
                errorMsg.textContent = "Error al autenticar. Verificá tus credenciales.";
        }
    }
});