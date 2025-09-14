import logger from "./Logger";
import InvalidPurchaseException from "../InvalidPurchaseException";
/**
 * External class for utility methods to allow for testability
 * and retain the business rules outside TicketService
 */

export default class TicketUtilService {
    MAXIMUM_TICKET_LIMIT = 25;
    ADULT_TICKET_PRICE = 25;
    CHILD_TICKET_PRICE = 15;
    INFANT_TICKET_PRICE = 0;

    /**
     * accountID should be an integer greater than zero
     * @param { Integer } accountID 
     * @returns { Boolean } or
     * @throws { InvalidPurchaseException }
     */
    isValidAccountID(accountID) {
        if (!(accountID > 0 && Number.isInteger(accountID))) {
            logger.log({
                message: "Invalid Account ID used " + accountID,
                level: "error"})
            throw new InvalidPurchaseException("UtilService error: Invalid account ID provided");
        }
        return true
    };

    /**
     * Is an adult present and the adult request not set to zero?
     * And are sufficient adults present for infants to sit on laps
     * @param { ...TicketTypeRequest } ticketTypeRequests 
     * @returns { Boolean } or 
     * @throws { InvalidPurchaseException }
     */
    hasValidAmountOfAdultsPresent(ticketTypeRequests) {
        let adultsRequested = 0;
        let infantsRequested = 0;
        let ticketRequests = Array.from(ticketTypeRequests)

        ticketRequests.forEach(req => {
            if (req.getTicketType() === "INFANT") {
                infantsRequested += req.getNoOfTickets();
            }
            if (req.getTicketType() === "ADULT" && req.getNoOfTickets() !== 0) {
                adultsRequested += req.getNoOfTickets();
            }
        });
        if (adultsRequested == 0 || (infantsRequested > adultsRequested)) {
            logger.log({
                message: "Insufficient adults for infants present: adults: " + adultsRequested + " infants: " + infantsRequested,
                level: "debug"})
            throw new InvalidPurchaseException("Request did not contain the required number of adults")
        }
        return true
    };

    /**
     * Count the number of tickets in the collection of requests
     * @param { ...TicketTypeRequest } ticketTypeRequests 
     * @returns { Integer } ticketCount or
     * @throws { InvalidPurchaseException }
     */
    countAndValidateTicketsInRequest (ticketTypeRequests) {
        let ticketCount = 0;
        let ticketRequests = Array.from(ticketTypeRequests)
        ticketRequests.forEach((request) => {
            ticketCount += request.getNoOfTickets();
        });

        if (ticketCount > this.MAXIMUM_TICKET_LIMIT) {
            logger.log({
                message: "request > max tickets allowed" + ticketCount,
                level: "error"})
            throw new InvalidPurchaseException("Maximum ticket limit exceeded")
        }

        return ticketCount
    };
   
    /**
     * Count the number of seats required for the request
     * @param { ...TicketTypeRequest } ticketTypeRequests 
     * @returns { Integer } seatCount
     */
    countSeatsInRequest(ticketTypeRequests) {
        let seatCount = 0;
        let ticketRequests = Array.isArray(ticketTypeRequests) ? ticketTypeRequests :Array.from(ticketTypeRequests)
        ticketRequests.forEach(req => {
            if (req.getNoOfTickets() !== 0 && req.getTicketType() !== "INFANT") {
                seatCount += req.getNoOfTickets();
            }
        })
        return seatCount
    };

    /**
     * Calculate the payment for the collection of requests
     * @param { ...TicketTypeRequest } ticketTypeRequests 
     * @returns { Integer } totalAmountToPay
     */
    calculatePayment(ticketTypeRequests) {
        let totalAmountToPay = 0;
        let ticketRequests = Array.from(ticketTypeRequests)

        ticketRequests.forEach(req => {
            if (req.getNoOfTickets() !== 0) {
                switch (req.getTicketType()) {
                    case "ADULT":
                        totalAmountToPay += this.ADULT_TICKET_PRICE * parseInt(req.getNoOfTickets());
                        break;
                    case "CHILD":
                        totalAmountToPay += this.CHILD_TICKET_PRICE * parseInt(req.getNoOfTickets());
                        break;
                    case "INFANT":
                        totalAmountToPay += this.INFANT_TICKET_PRICE * parseInt(req.getNoOfTickets()); // currently 0
                        break;
                    default:
                        totalAmountToPay += 0
                        break; // uncovered by tests as can't create a TicketTypeRequest with wrong type
                }
            }

        })
        return totalAmountToPay;
    };

}