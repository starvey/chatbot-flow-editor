import { Platform } from '../package/index'
import { MessageNodeType } from './node-types/Message'

const platform: Platform = new Platform()
platform.store.registerNodeType(new MessageNodeType())
