import EventHandlerInterface from '../../../@shared/event/event-handler.interface'
import CustomerAddressChangedEvent from '../Customer-address-changed.event'

export default class SendConsoleLogHandler
  implements EventHandlerInterface<CustomerAddressChangedEvent>
{
  handle(event: CustomerAddressChangedEvent): void {
    const id = event.eventData.id
    const name = event.eventData.name
    console.log(
      `Endereço do cliente: ${id}, ${name} alterado para: ${event.eventData.address}`
    )
  }
}
