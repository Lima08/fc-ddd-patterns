import EventInterface from '../../@shared/event/event.interface'
import Customer from '../entity/customer'

export default class CustomerAddressChangedEvent implements EventInterface {
  dataTimeOccurred: Date
  eventData: any

  constructor(eventData: any) {
    this.eventData = eventData
    this.dataTimeOccurred = new Date()
  }
}
