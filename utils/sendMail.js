import fetch from "node-fetch";

export default async function sendMail({ to, subject, html }) {
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sender: { name: "GLOM Store", email: "no-reply@glom.store" },
      to: [{ email: to }],
      subject,
      htmlContent: html
    })
  });
}
