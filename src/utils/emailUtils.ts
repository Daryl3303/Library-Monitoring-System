import { ReservationStatus } from "../components/adminComponents/manageReservation";
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

export function generateBorrowDeclineEmail(reservation: Reservation): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Dear <strong>${reservation.name}</strong>,</p>

      <p>
        We regret to inform you that your request to borrow the following book
        has been <strong>declined</strong> by the library.
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
          <td style="padding: 6px; font-weight: bold;">Requested Quantity:</td>
          <td style="padding: 6px;">${reservation.borrowQuantity}</td>
        </tr>
      </table>

      <p style="margin-top: 15px;">
        Unfortunately, the requested book is currently unavailable or your borrowing
        request does not meet the library’s criteria.
      </p>

      <p>
        Please contact the library office if you have any questions or would like
        assistance with alternative resources.
      </p>

      <p>We appreciate your understanding.</p>

      <br />

      <p>
        <strong>Library Administration</strong><br />
        ${reservation.department}
      </p>
    </div>
  `;
}

export function generateOverdueEmail(reservation: ReservationStatus): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Dear <strong>${reservation.name}</strong>,</p>

      <p>
        This is a friendly reminder that the following book you borrowed is now
        <strong>overdue</strong>.
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
        <tr>
          <td style="padding: 6px; font-weight: bold;">Return Date:</td>
          <td style="padding: 6px;">${reservation.returnDate}</td>
        </tr>
      </table>

      <p style="margin-top: 15px;">
        Please return the book as soon as possible to avoid any penalties or restrictions
        on future borrowing.
      </p>

      <p>
        If you have already returned the book, please disregard this message.
        Otherwise, contact the library office if you need assistance.
      </p>

      <p>Thank you for your prompt attention.</p>

      <br />

      <p>
        <strong>Library Administration</strong><br />
        ${reservation.department}
      </p>
    </div>
  `;
}
