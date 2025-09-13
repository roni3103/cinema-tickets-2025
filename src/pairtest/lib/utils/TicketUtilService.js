import logger from "./Logger";
import InvalidPurchaseException from "../InvalidPurchaseException";
/**
 * External class for utility methods to allow for testability
 * and retain the business rules outside TicketService
 */

export default class TicketUtils {
    MAXIMUM_TICKET_LIMIT = 25;
    ADULT_TICKET_PRICE = 25;
    CHILD_TICKET_PRICE = 15;
    INFANT_TICKET_PRICE = 0;

    /**
     * Is an adult present and the adult request not set to zero?
     * And are sufficient adults present for infants to sit on laps
     * @param { [TicketTypeRequest] } ticketTypeRequests 
     * @returns { Boolean }
     */
    hasValidAmountOfAdultsPresent(ticketTypeRequests, adultsRequested = 0, infantsRequested = 0) {
    };

    /**
     * accountID should be an integer greater than zero
     * @param { Integer } accountID 
     * @returns { Boolean }
     */
    hasValidAccountID(accountID) {
    };

    /**
     * Count the number of tickets in the collection of requests
     * @param { [TicketTypeRequest] } ticketTypeRequests 
     * @param { {Integer} } ticketCount initialised to 0
     * @returns { Integer } ticketCount
     */
    countTicketsInRequest(ticketTypeRequests, ticketCount = 0) {
    };

    /**
     * Count the number of seats required for the request
     * @param { [TicketTypeRequest] } ticketTypeRequests 
     * @param { Integer } seatCount  initialised to 0
     * @returns { Integer } seatCount
     */
    countSeatsInRequest(ticketTypeRequests, seatCount = 0) {
    };

    /**
     * 
     * @param { [TicketTypeRequest] } ticketTypeRequests 
     * @param { Integer } totalAmountToPay initialised to 0
     * @returns { Integer } totalAmountToPay
     */
    calculatePayment(ticketTypeRequests, totalAmountToPay = 0) {
    };

    /**
       * Check overall count validity using TICKET_UTILS
       * Return true if within limits (provided in TICKET_UTILS) or throw an error
       * @param { [TicketTypeRequest] } ticketTypeRequests 
       * @returns true
       * @throws { InvalidPurchaseException }
       */
    validateTicketCountInRequest = (count) => {
    };

    /**
     * Calls the external TicketPaymentService to make a booking
     * @param { Integer } accountId 
     * @param { Integer } totalAmountToPay
     * @throws { InvalidPurchaseException }
     */
    makePayment = (accountId, totalAmountToPay) => {
    };

    /**
     * Calls the external SeatReservationService to complete booking after payment is made
     * @param { Integer } accountId 
     * @param { Integer } totalSeatsToAllocate 
     * @throws { InvalidPurchaseException }
     */
    reserveSeats = (accountId, totalSeatsToAllocate) => {
    };

}