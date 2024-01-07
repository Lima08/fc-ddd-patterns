import EventDispatcher from '../../@shared/event/event-dispatcher'
import SendConsoleLogHandler from '../event/handler/send-console-log.handler'
import SendConsoleLog1Handler from '../event/handler/send-console-log1.handler'
import SendConsoleLog2Handler from '../event/handler/send-console-log2.handler'
import CustomerFactory from '../factory/customer.factory'
import customerRepositoryMock from '../mock/customer.repository.mock'
import Address from '../value-object/address'
import CustomerService from './customer.service'

describe('Customer service unit tests', () => {
  it('should emit CustomerCreated event when a customer is created and run registered handlers', async () => {
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

    const customer = CustomerFactory.create('Lima')
    await customerService.create(customer.id, customer.name)

    expect(spyHandler1).toBeCalled()
    expect(spyHandler2).toBeCalled()
  })

  it("Should emit an event that log a message with id, name and address when a customer'address is changed", async () => {
    const eventDispatcher = new EventDispatcher()
    const handler = new SendConsoleLogHandler()
    const spyHandler = jest.spyOn(handler, 'handle')
    const spyConsole = jest.spyOn(console, 'log')

    eventDispatcher.register('CustomerAddressChangedEvent', handler)

    const customerService = new CustomerService(
      new customerRepositoryMock(),
      eventDispatcher
    )

    const customer = CustomerFactory.create('Lima')
    await customerService.create(customer.id, customer.name)
    const newAddress = new Address('street', 1, '13000000', 'Campinas SP')
    await customerService.updateAddress(customer.id, newAddress)

    expect(spyHandler).toBeCalled()
    expect(spyConsole).toBeCalledWith(
      `Endereço do cliente: ${customer.id}, ${
        customer.name
      } alterado para: ${newAddress.toString()}`
    )
  })
})
