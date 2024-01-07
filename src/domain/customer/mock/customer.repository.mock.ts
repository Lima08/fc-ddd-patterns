import Customer from '../entity/customer'
import CustomerRepositoryInterface from '../repository/customer-repository.interface'

export default class customerRepositoryMock implements CustomerRepositoryInterface {
  async create(entity: Customer): Promise<void> {
    console.log(`Customer ${entity.name} created.`)
  }
  async update(entity: Customer): Promise<void> {
    console.log(`Customer ${entity.name} was updated.`)

  }
  async find(id: string): Promise<Customer> {
    console.log(`Customer ${id} was founded.`)
    return new Customer(id, 'Lima')

  }
  findAll(): Promise<Customer[]> {
    throw new Error('Method not implemented.')
  }
}