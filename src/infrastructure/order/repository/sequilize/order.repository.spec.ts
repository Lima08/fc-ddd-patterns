import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import CustomerFactory from '../../../../domain/customer/factory/customer.factory';

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a new order', async () => {
    const customerRepository = new CustomerRepository()
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    const customer = CustomerFactory.createWithAddress('Customer 1', address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2
    )
    const order = new Order('123', customer.id, [orderItem])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items']
    })

    expect(orderModel.toJSON()).toStrictEqual({
      id: '123',
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: '123',
          product_id: '123'
        }
      ]
    })
  })

  it('should update a order', async () => {
    const customerRepository = new CustomerRepository()
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    const customer = CustomerFactory.createWithAddress('Customer 1', address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2
    )
    const order = new Order('123', customer.id, [orderItem])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order)
    const newProduct = new Product('456', 'Product 2', 2)
    await productRepository.create(newProduct)

    const newOrderItem = new OrderItem(
      '2',
      newProduct.name,
      newProduct.price,
      newProduct.id,
      1
    )
    order.addItem(newOrderItem)
    await orderRepository.update(order)
    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items']
    })

    expect(orderModel.toJSON()).toStrictEqual({
      id: '123',
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: '123',
          product_id: '123'
        },
        {
          id: newOrderItem.id,
          name: newOrderItem.name,
          price: newOrderItem.price,
          quantity: newOrderItem.quantity,
          order_id: '123',
          product_id: '456'
        }
      ]
    })
  })

  it('should find a order', async () => {
    const customerRepository = new CustomerRepository()
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    const customer = CustomerFactory.createWithAddress('Customer 1', address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2
    )
    const order = new Order('123', customer.id, [orderItem])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order)
    const orderResult = await orderRepository.find(order.id)

    expect(order).toStrictEqual(orderResult)
  })

  it('should find all order', async () => {
    const customerRepository = new CustomerRepository()
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    const customer = CustomerFactory.createWithAddress('Customer 1', address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product(customer.id, 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2
    )
    const orderItem2 = new OrderItem(
      '2',
      product.name,
      product.price,
      product.id,
      2
    )
    const order = new Order('123', customer.id, [orderItem])
    const order2 = new Order('456', customer.id, [orderItem2])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order)
    await orderRepository.create(order2)
    const orderResult = await orderRepository.findAll()

    expect(orderResult.length).toBe(2)
  })

  it('should find a order', async () => {
    const customerRepository = new CustomerRepository()
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    const customer = CustomerFactory.createWithAddress('Customer 1', address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('123', 'Product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2
    )
    const order = new Order('123', customer.id, [orderItem])
    const orderRepository = new OrderRepository()
    await orderRepository.create(order)
    const foundedOrder = await orderRepository.find('123')

    expect(foundedOrder).toStrictEqual(order)
  })
})
