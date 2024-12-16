"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = __importStar(require("sinon"));
const DomainEvents_1 = require("../DomainEvents");
const mockJobCreatedEvent_1 = require("./mocks/events/mockJobCreatedEvent");
const mockJobDeletedEvent_1 = require("./mocks/events/mockJobDeletedEvent");
const mockJobAggregateRoot_1 = require("./mocks/domain/mockJobAggregateRoot");
const mockPostToSocial_1 = require("./mocks/services/mockPostToSocial");
const mockJobAggregateRootId_1 = require("./mocks/domain/mockJobAggregateRootId");
const UniqueEntityID_1 = require("../../UniqueEntityID");
let social;
let job;
let spy;
describe('Domain Events', () => {
    beforeEach(() => {
        social = null;
        DomainEvents_1.DomainEvents.clearHandlers();
        DomainEvents_1.DomainEvents.clearMarkedAggregates();
        spy = null;
        job = null;
    });
    describe('Given a JobCreatedEvent, JobDeletedEvent and a PostToSocial handler class', () => {
        it('Should be able to setup event subscriptions', () => {
            social = new mockPostToSocial_1.MockPostToSocial();
            social.setupSubscriptions();
            expect(Object.keys(DomainEvents_1.DomainEvents['handlersMap']).length).toBe(2);
            expect(DomainEvents_1.DomainEvents['handlersMap'][mockJobCreatedEvent_1.MockJobCreatedEvent.name].length).toBe(1);
            expect(DomainEvents_1.DomainEvents['handlersMap'][mockJobDeletedEvent_1.MockJobDeletedEvent.name].length).toBe(1);
        });
        it('There should be exactly one handler subscribed to the JobCreatedEvent', () => {
            social = new mockPostToSocial_1.MockPostToSocial();
            social.setupSubscriptions();
            expect(DomainEvents_1.DomainEvents['handlersMap'][mockJobCreatedEvent_1.MockJobCreatedEvent.name].length).toBe(1);
        });
        it('There should be exactly one handler subscribed to the JobDeletedEvent', () => {
            social = new mockPostToSocial_1.MockPostToSocial();
            social.setupSubscriptions();
            expect(DomainEvents_1.DomainEvents['handlersMap'][mockJobCreatedEvent_1.MockJobCreatedEvent.name].length).toBe(1);
        });
        it('Should add the event to the DomainEvents list when the event is created', () => {
            job = mockJobAggregateRoot_1.MockJobAggregateRoot.createJob({}, mockJobAggregateRootId_1.MockJobAggregateRootId);
            social = new mockPostToSocial_1.MockPostToSocial();
            social.setupSubscriptions();
            var domainEventsAggregateSpy = sinon.spy(DomainEvents_1.DomainEvents, "markAggregateForDispatch");
            // setTimeout(() => {
            //   expect(domainEventsAggregateSpy.calledOnce).toBeTruthy();
            //   expect(domainEventsAggregateSpy.callCount).toBe(0)
            //   expect(DomainEvents['markedAggregates'][0]['length']).toBe(1);
            // }, 1000);
        });
        it('Should call the handlers when the event is dispatched after marking the aggregate root', () => {
            social = new mockPostToSocial_1.MockPostToSocial();
            social.setupSubscriptions();
            var jobCreatedEventSpy = sinon.spy(social, "handleJobCreatedEvent");
            var jobDeletedEventSpy = sinon.spy(social, "handleDeletedEvent");
            // Create the event, mark the aggregate
            job = mockJobAggregateRoot_1.MockJobAggregateRoot.createJob({}, mockJobAggregateRootId_1.MockJobAggregateRootId);
            // Dispatch the events now
            DomainEvents_1.DomainEvents.dispatchEventsForAggregate(mockJobAggregateRootId_1.MockJobAggregateRootId);
            // setTimeout(() => {
            //   expect(jobCreatedEventSpy.calledOnce).toBeFalsy();
            //   expect(jobDeletedEventSpy.calledOnce).toBeTruthy();
            // }, 1000);
        });
        it('Should remove the marked aggregate from the marked aggregates list after it gets dispatched', () => {
            social = new mockPostToSocial_1.MockPostToSocial();
            social.setupSubscriptions();
            // Create the event, mark the aggregate
            job = mockJobAggregateRoot_1.MockJobAggregateRoot.createJob({}, mockJobAggregateRootId_1.MockJobAggregateRootId);
            // Dispatch the events now
            DomainEvents_1.DomainEvents.dispatchEventsForAggregate(mockJobAggregateRootId_1.MockJobAggregateRootId);
            // setTimeout(() => {
            //   expect(DomainEvents['markedAggregates']['length']).toBe(0);
            // }, 1000);
        });
        it('Should only add the domain event to the ', () => {
            social = new mockPostToSocial_1.MockPostToSocial();
            social.setupSubscriptions();
            // Create the event, mark the aggregate
            mockJobAggregateRoot_1.MockJobAggregateRoot.createJob({}, new UniqueEntityID_1.UniqueEntityID('99'));
            expect(DomainEvents_1.DomainEvents['markedAggregates']['length']).toBe(1);
            // Create a new job, it should also get marked
            job = mockJobAggregateRoot_1.MockJobAggregateRoot.createJob({}, new UniqueEntityID_1.UniqueEntityID('12'));
            expect(DomainEvents_1.DomainEvents['markedAggregates']['length']).toBe(2);
            // Dispatch another action from the second job created
            job.deleteJob();
            // The number of aggregates should be the same
            expect(DomainEvents_1.DomainEvents['markedAggregates']['length']).toBe(2);
            // However, the second aggregate should have two events now
            expect(DomainEvents_1.DomainEvents['markedAggregates'][1].domainEvents.length).toBe(2);
            // And the first aggregate should have one event
            expect(DomainEvents_1.DomainEvents['markedAggregates'][0].domainEvents.length).toBe(1);
            // Dispatch the event for the first job
            DomainEvents_1.DomainEvents.dispatchEventsForAggregate(new UniqueEntityID_1.UniqueEntityID('99'));
            expect(DomainEvents_1.DomainEvents['markedAggregates']['length']).toBe(1);
            // The job with two events should still be there
            expect(DomainEvents_1.DomainEvents['markedAggregates'][0].domainEvents.length).toBe(2);
            // Dispatch the event for the second job
            DomainEvents_1.DomainEvents.dispatchEventsForAggregate(new UniqueEntityID_1.UniqueEntityID('12'));
            // There should be no more domain events in the list
            expect(DomainEvents_1.DomainEvents['markedAggregates']['length']).toBe(0);
        });
    });
});
//# sourceMappingURL=domainEvents.spec.js.map