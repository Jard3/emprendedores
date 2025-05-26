const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Turno = require("../modelos/Turno");
const Trabajador = require("../modelos/Trabajador");
const Usuario = require("../modelos/Usuario");
const fs = require("fs");
const path = require("path");

// Cargar .env manualmente si es necesario
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envData = fs.readFileSync(envPath, "utf-8");
  envData.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) process.env[key.trim()] = value.trim();
  });
}

console.log("📦 Variables de entorno de correo cargadas");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.CORREO_USUARIO,
    pass: process.env.CORREO_CONTRASENA,
  },
});

// 📧 Al crear turno
async function enviarCorreoCreacionTurno(turno, trabajador) {
  const destinatario = turno.correoCliente;
  if (!destinatario) {
    console.warn("⚠️ Turno sin correo de cliente.");
    return;
  }

  const html = `
    <p>Hola,</p>
    <p>Tu turno ha sido agendado para el <strong>${turno.fecha}</strong> a las <strong>${turno.hora}</strong>.</p>
    <p>Con: <strong>${trabajador?.nombre || "un especialista"}</strong></p>
    <p>Gracias por usar nuestro servicio.</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.CORREO_USUARIO,
      to: destinatario,
      subject: "📅 Confirmación de turno",
      html,
    });
    console.log(`📨 Correo de confirmación enviado a ${destinatario}`);
  } catch (error) {
    console.error("❌ Error al enviar correo de confirmación:", error);
  }
}

// 🔁 Recordatorio 24 horas antes
async function enviarRecordatorios() {
  const turnos = await Turno.find({ estado: "pendiente" }).populate("trabajador usuario");

  for (const turno of turnos) {
    try {
      const ahora = new Date();
      const horaTurno = new Date(`${turno.fecha}T${turno.hora}`);
      const diffHoras = (horaTurno - ahora) / (1000 * 60 * 60);

      if (diffHoras > 23 && diffHoras < 25) {
        const urlConfirmar = `https://tusitio.com/confirmar-turno/${turno._id}`;
        const urlCancelar = `https://tusitio.com/cancelar-turno/${turno._id}`;

        const html = `
          <p>Hola,</p>
          <p>Este es un recordatorio de tu cita el <strong>${turno.fecha}</strong> a las <strong>${turno.hora}</strong>.</p>
          <p>Con: <strong>${turno.trabajador?.nombre || "el especialista"}</strong></p>
          <p>
            <a href="${urlConfirmar}" style="color: green;">✅ Confirmar</a> |
            <a href="${urlCancelar}" style="color: red;">❌ Cancelar</a>
          </p>
        `;

        const destinatario = turno.usuario?.email || turno.correoCliente || null;

        if (destinatario) {
          await transporter.sendMail({
            from: process.env.CORREO_USUARIO,
            to: destinatario,
            subject: "⏰ Recordatorio de tu cita",
            html,
          });
          console.log(`📧 Recordatorio enviado a ${destinatario}`);
        }

        if (turno.trabajador?.email) {
          await transporter.sendMail({
            from: process.env.CORREO_USUARIO,
            to: turno.trabajador.email,
            subject: "📅 Nuevo turno programado",
            html: `<p>Tienes una cita con un cliente el <strong>${turno.fecha}</strong> a las <strong>${turno.hora}</strong>.</p>`,
          });
          console.log(`📩 Correo enviado al trabajador: ${turno.trabajador.email}`);
        }
      }
    } catch (err) {
      console.error(`❌ Error procesando turno ${turno._id}:`, err);
    }
  }
}

// ⏰ Notificación justo a la hora del turno
async function enviarNotificacionTurnoEnHora() {
  const ahora = new Date();
  const fechaActual = ahora.toISOString().split("T")[0];
  const horaActual = ahora.toTimeString().slice(0, 5); // "HH:MM"

  const turnos = await Turno.find({ fecha: fechaActual, hora: horaActual }).populate("trabajador usuario");

  for (const turno of turnos) {
    const cliente = turno.usuario?.email || turno.correoCliente;
    const trabajador = turno.trabajador?.email;

    const htmlCliente = `
      <p>Hola,</p>
      <p>Te recordamos que tu turno es ahora mismo: <strong>${turno.fecha}</strong> a las <strong>${turno.hora}</strong>.</p>
      <p>Gracias por tu puntualidad.</p>
    `;

    if (cliente) {
      try {
        await transporter.sendMail({
          from: process.env.CORREO_USUARIO,
          to: cliente,
          subject: "🔔 Tu turno es ahora",
          html: htmlCliente,
        });
        console.log(`⏰ Notificación enviada a cliente: ${cliente}`);
      } catch (error) {
        console.error("❌ Error al notificar al cliente:", error);
      }
    }

    if (trabajador) {
      try {
        await transporter.sendMail({
          from: process.env.CORREO_USUARIO,
          to: trabajador,
          subject: "🕒 Turno en curso",
          html: `<p>Tienes un turno que comienza ahora con un cliente.</p>`,
        });
        console.log(`⏰ Notificación enviada al trabajador: ${trabajador}`);
      } catch (error) {
        console.error("❌ Error al notificar al trabajador:", error);
      }
    }
  }
}

// 🕒 Tarea programada cada minuto
cron.schedule("* * * * *", () => {
  console.log("⏱️ Ejecutando recordatorios y notificaciones...");
  enviarRecordatorios();
  enviarNotificacionTurnoEnHora();
});

// ✅ Exportaciones
module.exports = {
  enviarRecordatorios,
  enviarCorreoCreacionTurno,
};
