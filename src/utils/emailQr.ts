import axios from "axios";
import QRCode from "qrcode";

type User = {
  name: string;
  email: string;
  uid: string;
};
export async function sendNewUserEmail(user: User, password: string) {
  // 1️⃣ Generate QR code as DataURL
  const qrCodeDataUrl = await QRCode.toDataURL(user.uid, {
    width: 300,
    margin: 2,
  });

  // 2️⃣ Extract pure base64 (remove data:image/png;base64,)
  const qrBase64 = qrCodeDataUrl.split(",")[1];

  // 3️⃣ Build HTML email
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Dear <strong>${user.name}</strong>,</p>

      <p>
        Welcome to the Library System! Your account has been successfully created.
        Below are your login credentials.
      </p>

      <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
        <tr>
          <td style="padding: 6px; font-weight: bold;">Email:</td>
          <td style="padding: 6px;">${user.email}</td>
        </tr>
        <tr>
          <td style="padding: 6px; font-weight: bold;">Temporary Password:</td>
          <td style="padding: 6px;">${password}</td>
        </tr>
        <tr>
          <td style="padding: 6px; font-weight: bold;">User ID (UID):</td>
          <td style="padding: 6px;">${user.uid}</td>
        </tr>
      </table>

      <p style="margin-top: 15px;">
         Your QR code is attached to this email.
      </p>

      <p style="margin-top: 15px;">
        You can use this QR code to verify your identity when borrowing or returning books.
      </p>
    </div>
  `;

  // 4️⃣ Send email with attachment via Lambda API
  return axios.post(import.meta.env.VITE_EMAIL_API_URL, {
    recipient: user.email,
    subject: "Your Library Account",
    html,
    attachments: [
      {
        filename: "qr-code.png",
        content: qrBase64,
        content_type: "image/png",
      },
    ],
  });
}