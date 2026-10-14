// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Capturar elementos del HTML
const formulario = document.getElementById('formClientes');
const btnEnviar = document.getElementById('btn-enviar');
const mostrarMensaje = document.getElementById('mostrar-mensaje');

// Muestra un mensaje de éxito o error
function mostrar(texto, tipo) {
    mostrarMensaje.textContent = texto;
    mostrarMensaje.className = tipo;
}

// Validación con JavaScript: devuelve el error o null si todo está bien
function validar(d) {
    if (d.nombre.length < 3) {
        return 'El nombre debe tener al menos 3 caracteres.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
        return 'Ingresa un correo electrónico válido.';
    }
    if (d.celular && !/^9\d{8}$/.test(d.celular)) {
        return 'El celular debe tener 9 dígitos y empezar con 9.';
    }
    if (!d.motivo) {
        return 'Selecciona el motivo de tu mensaje.';
    }
    if (!Number.isInteger(d.cantidad) || d.cantidad < 1 || d.cantidad > 50) {
        return 'La cantidad debe ser un número entre 1 y 50.';
    }
    if (d.mensaje.length < 10 || d.mensaje.length > 500) {
        return 'El mensaje debe tener entre 10 y 500 caracteres.';
    }
    if (!d.acepta) {
        return 'Debes aceptar el uso de tus datos para continuar.';
    }
    return null;
}

formulario.addEventListener('submit', async function (event) {
    event.preventDefault();

    const datos = {
        nombre:   document.getElementById('nombre').value.trim(),
        email:    document.getElementById('correo').value.trim(),
        celular:  document.getElementById('telefono').value.trim(),
        motivo:   document.getElementById('consulta').value,
        producto: document.getElementById('producto').value,
        cantidad: Number(document.getElementById('cantidad').value),
        mensaje:  document.getElementById('mensaje').value.trim(),
        acepta:   document.getElementById('acepto').checked
    };

    const error = validar(datos);
    if (error) {
        mostrar(error, 'error');
        return;
    }

    try {
        btnEnviar.textContent = 'Enviando...';
        btnEnviar.disabled = true;

        await addDoc(collection(db, 'solicitudes'), {
            nombre: datos.nombre,
            email: datos.email,
            celular: datos.celular,
            motivo: datos.motivo,
            producto: datos.producto,
            cantidad: datos.cantidad,
            mensaje: datos.mensaje,
            aceptaDatos: datos.acepta,
            fecha: serverTimestamp()
        });

        mostrar('Solicitud enviada correctamente', 'exito');
        formulario.reset();

    } catch (error) {
        console.error('Error al guardar:', error);
        mostrar('Error al enviar el mensaje', 'error');
    } finally {
        btnEnviar.textContent = 'Enviar mensaje';
        btnEnviar.disabled = false;
    }
});