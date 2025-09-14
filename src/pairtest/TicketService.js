import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import logger from "./lib/utils/Logger.js";

export default class TicketService {
  // Use dependency injection so that these components can be changed at will
  constructor(ticketUtils, seatReserver, paymentService) {
    this.TICKET_UTILS = ticketUtils;
    this.SEAT_RESERVER = seatReserver;
    this.PAYMENT_SERVICE = paymentService;
  }
  
  /**
   * Should only have private methods other than the one below.
   */

  /**
     * Validate all required business rules, calculate, request payment and book seats 
     * @param { Integer } accountID 
     * @param { ...TicketTypeRequest } ticketTypeRequests 
     * @returns { Integer } totalAmountToPay
     */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    try {
      const hasValidAccountID = this.TICKET_UTILS.isValidAccountID(accountId);
      const hasValidAmountOfAdultsPresent = this.TICKET_UTILS.hasValidAmountOfAdultsPresent(ticketTypeRequests);
      const ticketCount = this.TICKET_UTILS.countAndValidateTicketsInRequest(ticketTypeRequests);
      const isValidBooking = hasValidAccountID && hasValidAmountOfAdultsPresent && ticketCount > 0;

      const totalAmountToPay = this.TICKET_UTILS.calculatePayment(ticketTypeRequests);
      const totalSeatsToAllocate = this.TICKET_UTILS.countSeatsInRequest(ticketTypeRequests);
      
      if (isValidBooking){
          this.PAYMENT_SERVICE.makePayment(accountId, totalAmountToPay);
          this.SEAT_RESERVER.reserveSeat(accountId, totalSeatsToAllocate)
      }
      return {
        status: 200,
        message: `Reservation for ${ticketCount} (${totalSeatsToAllocate} seats) at cost £${totalAmountToPay}`
      }

    } catch (err) {
      logger.log({
        message: "An error was thrown while booking",
        level: "error"
      })
      throw new InvalidPurchaseException("Error during booking: " + err.message)
    };
  }
}
