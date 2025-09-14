# Cinema Tickets
A simple NodeJS module to handle ticket booking
NOTE - REQUIRES NODE VERSION ^20

## How to use this module
To begin - clone the repo and run `npm install` to install required dependencies
To run unit tests - `npm test`
To use other logging levels, create an .env file at root of project as appropriate with `LOG_LEVEL=debug`
(this file can be used to bring in any additional environment variables such as api URLs at later date)

## Business Rules
Currently 3 types of ticket allowed, (ADULT, CHILD, INFANT)
An adult must be present on every booking
Ticket booking limit is 25 per request
Current Prices (ADULT = 25, CHILD = 15, INFANT = 0)
Infants currently free but must sit on an adult lap

## Error handling
Throws TypeError, InvalidPurchaseException
* invalid accountId (forwarded from TypeError thrown by TicketTypeRequest or external services)
* incorrect ticket type requested (forwarded from TypeError thrown by TicketTypeRequest)
* booking request without an adult present
* booking request with insufficient adults present for infants on 1>1 basis
* booking request with invalid values for the number of tickets
* booking request that exceeds maximum limit
* failure in external services
* unhandled errors in TicketService (e.g. network error)

## Developer Assumptions/Notes
It is assumed that each infant will sit on a single adult lap 

Pipeline currently runs on all push and PR to branches
Unit testing and mocking provided using Vitest

## CI/CD Pipeline
A very simple Github Actions pipeline has been added to run simple static quality checks



