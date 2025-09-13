import TicketUtilService from "../src/pairtest/lib/utils/TicketUtilService";
import { describe, test, expect, beforeEach } from "vitest";
import * as TestData from "./TestData";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException";

test('it should be defined', () => {
    expect(TicketUtilService).toBeDefined();
}
);

test('should have max ticket limit', () => {
    expect(TicketUtilService.MAXIMUM_TICKET_LIMIT).toBe(25);
})

describe('isValidAccountID', () => {
    test("should be defined", () => {
        expect(TicketUtilService.isValidAccountID).toBeDefined();
    });

    test.each([
        [true, 123, "valid integer"],
        [true, 123e5, "valid exponential"],

    ])(
        "it should return %j for accountID %j (%j)",
        (result, accountId) => {
            expect(TicketUtilService.isValidAccountID(accountId)).toBe(result);
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
                TicketUtilService.isValidAccountID(id);
            }).toThrow(new InvalidPurchaseException("Account ID must be a positive integer"));
        }
    );

});

describe('hasValidAmountOfAdultsPresent', () => {
    test("should be defined", () => {
        expect(TicketUtilService.hasValidAmountOfAdultsPresent).toBeDefined();
    });

    test.each([
        [true, [TestData.oneAdultReq], "1 adult"],
        [true, TestData.familyReq, "1 adult, 2 child, 1 infant"]
    ])(
        "it should return true for request %j (%j)",
        (result, request) => {
            expect(TicketUtilService.hasValidAmountOfAdultsPresent(request)).toBe(result);
        }
    );
    test.each([
        [TestData.bigFamilyReq, "1 adult, 2 child, 2 infant"],
        [TestData.zeroAdultReq, "Zero adults"],
        [TestData.twoChildReq, "2 children no adult"],
        [TestData.childrenAndInfantsWithZeroAdultReq, "Zero adult, 2 child, 2 infant"]
    ])(
        "it should throw an error for request %j (%j)",
        (request) => {
            expect(() => {
                TicketUtilService.hasValidAmountOfAdultsPresent(request);
            }).toThrow(new InvalidPurchaseException("Request did not contain the required number of adults"));
        }
    );
});

describe("countAndValidateTicketsInRequest", () => {
    test("should be defined", () => {
        expect(TicketUtilService.countAndValidateTicketsInRequest).toBeDefined();
    });

    test.each([
        [4, TestData.familyReq, "1 adult 2 child 1 infant"],
        [0, [TestData.zeroAdultReq], "0 adults - param intialised to 0"],
    ])(
        "it should return %j for request %j (%j)",
        (result, request) => {
            expect(TicketUtilService.countAndValidateTicketsInRequest(request)).toBe(result);
        }
    );
    test.each([
        [TestData.familyTooBigReq, "25 adults 1 infant"],
        [TestData.giantGroupReq, "25 adults, 1 infant, 2 child, 25 more adults"]
    ])(
        "it should throw error for request %j (%j)",
        (request) => {
            expect(() => {
                TicketUtilService.countAndValidateTicketsInRequest(request);
            }).toThrow(new InvalidPurchaseException("Maximum ticket limit exceeded"));
        }
    );

});

describe("countSeatsInRequest", () => {
    test("should be defined", () => {
        expect(TicketUtilService.countSeatsInRequest).toBeDefined();
    });

    test.each([
        [3, TestData.familyReq, "1 adult 2 child 1 infant"],
        [25, TestData.familyTooBigReq, "25 adults 1 infant"],
        [0, TestData.zeroAdultReq, "0 adults - param intialised to 0"],
    ])(
        "it should return %j for request %j (%j)",
        (result, request) => {
            expect(TicketUtilService.countSeatsInRequest(request)).toBe(result);
        }
    );
});

describe("calculatePayment", () => {
    test("should be defined", () => {
        expect(TicketUtilService.calculatePayment).toBeDefined();
    });

    test.each([
        [55, TestData.familyReq, "1 adult 2 child 1 infant"],
        [0, TestData.twoInfantReq, "2 infant"],
        [625, TestData.familyTooBigReq, "25 adults 1 infant"],
        [0, TestData.zeroAdultReq, "0 adults - param intialised to 0"],
    ])(
        "it should return %j for request %j (%j)",
        (result, request) => {
            expect(TicketUtilService.calculatePayment(request)).toBe(result);
        }
    );
    
})
