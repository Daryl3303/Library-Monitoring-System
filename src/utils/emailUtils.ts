import { Reservation } from "../components/adminComponents/resevations";

export function generateBorrowConfirmationEmail(
  reservation: Reservation
): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Dear <strong>${reservation.name}</strong>,</p>

      <p>
        Good day! This email is to confirm that you have successfully borrowed the
        following book from the library.
      </p>

      <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
        <tr>
          <td style="padding: 6px; font-weight: bold;">Reference Number:</td>
          <td style="padding: 6px;">${reservation.referenceNumber}</td>
        </tr>
        <tr>
          <td style="padding: 6px; font-weight: bold;">Book Title:</td>
          <td style="padding: 6px;">${reservation.bookTitle}</td>
        </tr>
        <tr>
          <td style="padding: 6px; font-weight: bold;">Author:</td>
          <td style="padding: 6px;">${reservation.bookAuthor}</td>
        </tr>
        <tr>
          <td style="padding: 6px; font-weight: bold;">ISBN:</td>
          <td style="padding: 6px;">${reservation.bookIsbn}</td>
        </tr>
        <tr>
          <td style="padding: 6px; font-weight: bold;">Quantity Borrowed:</td>
          <td style="padding: 6px;">${reservation.borrowQuantity}</td>
        </tr>
      </table>

      <p style="margin-top: 15px;">
        Please keep your <strong>reference number</strong> for transaction tracking
        and future inquiries.
      </p>

      <p>
        If you have any concerns, feel free to contact the library office.
      </p>

      <p>Thank you and happy reading!</p>

      <br />

      <p>
        <strong>Library Administration</strong><br />
        ${reservation.department}
      </p>
    </div>
  `;
}
