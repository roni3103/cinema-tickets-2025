import TicketUtilService from "../src/pairtest/lib/utils/TicketUtilService";
import TicketService from "../src/pairtest/TicketService";

import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService.js";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService.js";

import { describe, test, expect, beforeEach, vi} from "vitest";

import * as TestData from "./TestData";

describe("TicketService", () => {
    let mockSeatReservationService, mockTicketPaymentService;
    let ticketUtilService = new TicketUtilService();
    let srs = new SeatReservationService();
    let tps = new TicketPaymentService();

    const testTicketService =  new TicketService(ticketUtilService, srs, tps);
    beforeEach(() => {
        // reset any previous mock and mock the appropriate services anew
        vi.clearAllMocks();  
        mockTicketPaymentService = vi.spyOn(TicketPaymentService.prototype, "makePayment");
        mockSeatReservationService = vi.spyOn(SeatReservationService.prototype, "reserveSeat");
    })


    test("should take payment, book seat and return succesful if adult request present", () => {
        const result = testTicketService.purchaseTickets(TestData.goodAccountNum,TestData.oneAdultReq, TestData.twoChildReq, TestData.oneInfantReq);  
        expect(mockTicketPaymentService).toHaveBeenCalledWith(1200, 55);
        expect(mockSeatReservationService).toHaveBeenCalledWith(1200,3);
        expect(result.message).toEqual("Reservation for 4 (3 seats) at cost £55");
        expect(result.status).toEqual(200);        
    })

    test("should take payment, book seat and return succesful for exactly 25 ticket requests", () => {
        const result = testTicketService.purchaseTickets(TestData.goodAccountNum,TestData.twentyFiveAdultsReq);
        expect(mockTicketPaymentService).toHaveBeenCalledWith(1200, 625);
        expect(mockSeatReservationService).toHaveBeenCalledWith(1200, 25);
        expect(result.message).toEqual("Reservation for 25 (25 seats) at cost £625");
        expect(result.status).toEqual(200);
    })

    test("should not call booking services if no adult request present", () => {
        expect(() => {
            testTicketService.purchaseTickets(TestData.goodAccountNum, TestData.twoChildReq);
        }).toThrow("Error during booking: Request did not contain the required number of adults");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled();        
    });

    test("should throw error and not call booking services if too many seats requested", () => {
        expect(() => {
            testTicketService.purchaseTickets(TestData.goodAccountNum, TestData.twentyFiveAdultsReq, TestData.oneInfantReq);
        }).toThrow("Error during booking: Maximum ticket limit exceeded");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled(); 
                
    });

    // Testing that zero and negative bookings are prevented
    test("should throw error and not call booking services if no seats requested", () => {
        expect(() => {
            testTicketService.purchaseTickets(TestData.goodAccountNum, TestData.zeroAdultReq);
        }).toThrow("Error during booking: Request did not contain the required number of adults");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled(); 
    });

    test("should throw error and not call booking services if negative seats requested", () => {
        expect(() => {
            testTicketService.purchaseTickets(TestData.goodAccountNum, TestData.negativeAdultReq);
        }).toThrow("Error during booking: Request did not contain the required number of adults");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled(); 
    });

    test("should throw error and not call booking services if account number is not an integer", () => {
        expect(() => {
            testTicketService.purchaseTickets(TestData.stringAccountNum, TestData.oneAdultReq);
        }).toThrow("Error during booking: UtilService error: Invalid account ID provided");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled();        
    });

    test("should throw error and not call booking services if account number is zero", () => {
        expect(() => {
            testTicketService.purchaseTickets(0, TestData.oneAdultReq);
        }).toThrow("Error during booking: UtilService error: Invalid account ID provided");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled();         
    });

    test("should throw error and not call booking services if account number is below zero", () => {
        expect(() => {
            testTicketService.purchaseTickets(-1, TestData.oneAdultReq);
        }).toThrow("Error during booking: UtilService error: Invalid account ID provided");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled();          
    });

    test("with random failure in external seat reservation service it should handle and propagate error", () => {

        mockSeatReservationService.mockImplementation(() => {
            throw new Error("User not found");
        });

        expect(() => {
            testTicketService.purchaseTickets(TestData.goodAccountNum, TestData.oneAdultReq);
        }).toThrow(new InvalidPurchaseException("Error during booking: User not found"));
        expect(mockTicketPaymentService).toHaveBeenCalled();
        expect(mockSeatReservationService).toHaveBeenCalled();   
    });

    test("with random failure in external ticket payment service it should handle and propagate error and not reserve seats", () => {
        mockTicketPaymentService.mockImplementation(() => {
            throw new Error("User not found");
          });

        expect(() => {
            testTicketService.purchaseTickets(TestData.goodAccountNum, TestData.oneAdultReq);
        }).toThrow("Error during booking: User not found");
        expect(mockTicketPaymentService).toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled(); 
    });

    test("with failure in ticket service it should throw error and not request payment or reserve seats", () => {
        const myFakeTicketService = vi.spyOn(TicketService.prototype, "purchaseTickets");
        myFakeTicketService.mockImplementation(() => {
            throw new Error("Fake internal error");
        });
        
        expect(() => {
            testTicketService.purchaseTickets(TestData.goodAccountNum, TestData.oneAdultReq);
        }).toThrow("Fake internal error");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled();   
    });

})

