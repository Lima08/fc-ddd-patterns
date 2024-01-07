import Customer from '../entity/customer'
import CustomerRepositoryInterface from '../repository/customer-repository.interface'

export default class customerRepositoryMock implements CustomerRepositoryInterface {
  async create(entity: Customer): Promise<void> {
    console.log(`Customer ${entity.name} created.`)
  }
  update(entity: Customer): Promise<void> {
    throw new Error('Method not implemented.')
  }
  find(id: string): Promise<Customer> {
    throw new Error('Method not implemented.')
  }
  findAll(): Promise<Customer[]> {
    throw new Error('Method not implemented.')
  }
}