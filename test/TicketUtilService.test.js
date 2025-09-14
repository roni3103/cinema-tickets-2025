import TicketUtilService from "../src/pairtest/lib/utils/TicketUtilService";
import { describe, test, expect } from "vitest";
import * as TestData from "./TestData";

const ticketUtilService = new TicketUtilService();

test("it should be defined", () => {
    expect(ticketUtilService).toBeDefined();
}
);

test("should have max ticket limit", () => {
    expect(ticketUtilService.MAXIMUM_TICKET_LIMIT).toBe(25);
})


describe("isValidAccountID", () => {
    test("should be defined", () => {
        expect(ticketUtilService.isValidAccountID).toBeDefined();
    });

    test.each([
        [true, 123, "valid integer"],
        [true, 123e5, "valid exponential"],

    ])(
        "it should return %j for accountID %j (%j)",
        (result, accountId) => {
            expect(ticketUtilService.isValidAccountID(accountId)).toBe(result);
        }
    );

    test.each([
        ["ONE", "String"],
        [0, "zero"],
        [-2, "negative"],
        [null, "null"],
        [undefined, "undefined"]
    ])(
        "it should throw error for request %j (%j)",
        (id) => {
            expect(() => {
                ticketUtilService.isValidAccountID(id);
            }).toThrow("UtilService error: Invalid account ID provided");
        }
    );

});

describe("hasValidAmountOfAdultsPresent", () => {
    test("should be defined", () => {
        expect(ticketUtilService.hasValidAmountOfAdultsPresent).toBeDefined();
    });

    test.each([
        [true, [TestData.oneAdultReq], "1 adult"],
        [true, TestData.familyReq, "1 adult, 2 child, 1 infant"]
    ])(
        "it should return true for request %j (%j)",
        (result, request) => {
            expect(ticketUtilService.hasValidAmountOfAdultsPresent(request)).toBe(result);
        }
    );
    test.each([
        [TestData.bigFamilyReq, "1 adult, 2 child, 2 infant"],
        [TestData.zeroAdultReq, "Zero adults"],
        [TestData.twoChildReq, "2 children no adult"],
        [TestData.childrenAndInfantsWithZeroAdultReq, "Zero adult, 2 child, 2 infant"]
    ])(
        "it should throw error for request %j (%j)",
        (request) => {
            expect(() => {
                ticketUtilService.hasValidAmountOfAdultsPresent(request);
            }).toThrow("Request did not contain the required number of adults");
        }
    );
});

describe("countAndValidateTicketsInRequest", () => {
    test("should be defined", () => {
        expect(ticketUtilService.countAndValidateTicketsInRequest).toBeDefined();
    });

    test.each([
        [4, TestData.familyReq, "1 adult 2 child 1 infant"],
        [0, [TestData.zeroAdultReq], "0 adults"],
    ])(
        "it should return %j for request %j (%j)",
        (result, request) => {
            expect(ticketUtilService.countAndValidateTicketsInRequest(request)).toBe(result);
        }
    );
    test.each([
        [TestData.familyTooBigReq, "25 adults 1 infant"],
        [TestData.giantGroupReq, "25 adults, 1 infant, 2 child, 25 more adults"]
    ])(
        "it should throw error for request %j (%j)",
        (request) => {
            expect(() => {
                ticketUtilService.countAndValidateTicketsInRequest(request);
            }).toThrow("Maximum ticket limit exceeded");
        }
    );

});

describe("countSeatsInRequest", () => {
    test("should be defined", () => {
        expect(ticketUtilService.countSeatsInRequest).toBeDefined();
    });

    test.each([
        [3, TestData.familyReq, "1 adult 2 child 1 infant"],
        [25, TestData.familyTooBigReq, "25 adults 1 infant"],
        [0, TestData.zeroAdultReq, "0 adults"],
    ])(
        "it should return %j for request %j (%j)",
        (result, request) => {
            expect(ticketUtilService.countSeatsInRequest(request)).toBe(result);
        }
    );
});

describe("calculatePayment", () => {
    test("should be defined", () => {
        expect(ticketUtilService.calculatePayment).toBeDefined();
    });

    test.each([
        [55, TestData.familyReq, "1 adult 2 child 1 infant"],
        [0, TestData.twoInfantReq, "2 infant"],
        [625, TestData.familyTooBigReq, "25 adults 1 infant"],
        [0, TestData.zeroAdultReq, "0 adults"],
    ])(
        "it should return %j for request %j (%j)",
        (result, request) => {
            expect(ticketUtilService.calculatePayment(request)).toBe(result);
        }
    );
    
})
