import EventInterface from '../../@shared/event/event.interface'

export default class CustomerCreatedEvent implements EventInterface {
  dataTimeOccurred: Date
  eventData: any

  constructor(eventData: any) {
    eventData = eventData
    this.dataTimeOccurred = new Date()
  }
}
