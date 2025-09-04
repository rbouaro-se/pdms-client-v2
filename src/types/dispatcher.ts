import { DispatcherType } from "./parcel";


export interface Agent {
  agentId: string
  firstName: string
  lastName: string
}

export interface Dispatcher {
  dispatcherId: string
  dispatcherNumber: string
  type: DispatcherType
  agent: Agent
  available: boolean
}

export interface CreateDispatcherRequest {
  dispatcherNumber: string
  type: DispatcherType
  agentId: string
}

export interface DispatcherFilterOptions {
  type?: DispatcherType
  available?: boolean
}