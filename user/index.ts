import { Platform } from '../package/index'
import { MessageNodeType } from './node-types/Message'
import { WebApiNodeType } from './node-types/WebApi'

const platform: Platform = new Platform()
platform.store.registerNodeType(new MessageNodeType())
platform.store.registerNodeType(new WebApiNodeType())