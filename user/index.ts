import { Platform } from '../package/index'
import { MessageNode } from './node-types/Message'

const platform: Platform = new Platform()
platform.store.registerNodeType(new MessageNode())
