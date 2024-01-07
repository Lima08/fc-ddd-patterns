import EventDispatcher from '../../@shared/event/event-dispatcher'
import SendConsoleLog1Handler from '../event/handler/send-console-log1.handler'
import SendConsoleLog2Handler from '../event/handler/send-console-log2.handler'
import customerRepositoryMock from '../mock/customer.repository.mock'
import CustomerService from './customer.service'

describe('Customer service unit tests', () => {
  it('should emit CustomerCreated event when a customer is created and run registered handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const handler1 = new SendConsoleLog1Handler()
    const handler2 = new SendConsoleLog2Handler()
    const spyHandler1 = jest.spyOn(handler1, 'handle')
    const spyHandler2 = jest.spyOn(handler2, 'handle')

    eventDispatcher.register('CustomerCreatedEvent', handler1)
    eventDispatcher.register('CustomerCreatedEvent', handler2)

    const customerService = new CustomerService(
      new customerRepositoryMock(),
      eventDispatcher
    )

    customerService.create('Lima')

    expect(spyHandler1).toBeCalled()
    expect(spyHandler2).toBeCalled()
  })
})
