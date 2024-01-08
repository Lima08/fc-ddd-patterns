import Order from '../../../../domain/checkout/entity/order'
import OrderItem from '../../../../domain/checkout/entity/order_item'
import OrderRepositoryInterface from '../../../../domain/checkout/repository/order-repository.interface'
import OrderItemModel from './order-item.model'
import OrderModel from './order.model'

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    try {
      await OrderModel.create(
        {
          id: entity.id,
          customer_id: entity.customerId,
          total: entity.total(),
          items: entity.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity
          }))
        },
        {
          include: [{ model: OrderItemModel }]
        }
      )
    } catch (error) {
      throw error
    }
  }

  async update(entity: Order): Promise<void> {
    try {
      await OrderModel.update(
        {
          total: entity.total(),
          customer_id: entity.customerId
        },
        { where: { id: entity.id } }
      )

      for (const item of entity.items) {
        await OrderItemModel.upsert(
          {
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
            order_id: entity.id
          },
          { returning: true }
        )
      }
    } catch (error) {
      throw error
    }
  }

  async find(id: string): Promise<Order> {
    try {
      const order = await OrderModel.findOne({
        where: { id },
        include: ['items']
      })

      if (!order) {
        throw new Error('Order not found')
      }

      const items = order.items.map((item) => {
        return new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        )
      })

      return new Order(order.id, order.customer_id, items)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<Order[]> {
    return OrderModel.findAll({
      include: ['items']
    }).then((orders) => {
      return orders.map((order) => {
        const items = order.items.map((item) => {
          return new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
          )
        })

        return new Order(order.id, order.customer_id, items)
      })
    })
  }
}
