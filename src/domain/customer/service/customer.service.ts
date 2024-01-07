import EventDispatcherInterface from '../../@shared/event/event-dispatcher.interface'
import CustomerFactory from '../factory/customer.factory'
import CustomerCreatedEvent from '../event/Customer-created.event'
import CustomerRepositoryInterface from '../repository/customer-repository.interface'

export default class CustomerService {
  constructor(
    private repository: CustomerRepositoryInterface,
    private dispatcher: EventDispatcherInterface
  ) {}

  async create(name: string) {
    const newCustomer = CustomerFactory.create(name)
    try {
      const customer = this.repository.create(newCustomer)
      const event = new CustomerCreatedEvent(customer)
      this.dispatcher.notify(event)
    } catch (error) {
      throw error
    }
  }
}
