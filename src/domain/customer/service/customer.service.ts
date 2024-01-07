import EventDispatcherInterface from '../../@shared/event/event-dispatcher.interface'
import CustomerCreatedEvent from '../event/Customer-created.event'
import CustomerRepositoryInterface from '../repository/customer-repository.interface'
import Address from '../value-object/address'
import Customer from '../entity/customer'
import CustomerAddressChangedEvent from '../event/Customer-address-changed.event'

export default class CustomerService {
  constructor(
    private repository: CustomerRepositoryInterface,
    private dispatcher: EventDispatcherInterface
  ) {}

  async create(id: string, name: string): Promise<void> {
    const newCustomer = new Customer(id, name)

    try {
      const customer = this.repository.create(newCustomer)
      const event = new CustomerCreatedEvent(customer)
      this.dispatcher.notify(event)
    } catch (error) {
      throw error
    }
  }

  async updateAddress(id: string, address: Address): Promise<void> {
    try {
      const customer = await this.repository.find(id)
      if (!customer) {
        throw new Error('Customer not found')
      }

      const updatedCustomer = new Customer(id, customer.name)
      updatedCustomer.changeAddress(address)
      await this.repository.update(updatedCustomer)
      const event = new CustomerAddressChangedEvent(updatedCustomer.toString())
      this.dispatcher.notify(event)
    } catch (error) {
      throw error
    }
  }
}
