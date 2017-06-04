import { Store } from '../store'
import { FlowNode } from '../classes/FlowNode'
import { FlowNodeType } from '../classes/FlowNodeType'

export class FlowRenderer {
  baseElement: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  store: Store
  elements: object= {}
  elementsBox: object = {
    h: 30,
    w: 260
  }
  canvasRect: ClientRect;

  constructor (store: Store) {
    this.store = store
    const $canvas = document.createElement('canvas')
    document.querySelector('.content__main-content').appendChild($canvas)
    $canvas.width = 4000
    $canvas.height = 4000
    $canvas.setAttribute('id', 'content-canvas')
    this.baseElement = $canvas
    this.canvasRect = $canvas.getBoundingClientRect()
    this.ctx = $canvas.getContext('2d')
    $canvas.addEventListener('mousedown', (event) => {
      console.log(this.getMousePosition(event))
    })
  }

  getMousePosition(event: MouseEvent) {
    return {
      x: event.clientX - this.canvasRect.left,
      y: event.clientY - this.canvasRect.top
    }
  }

  drawRect ({node, nodeType}) {
    this.ctx.save()
    this.ctx.rect(node.x, node.y, this.elementsBox['w'], this.elementsBox['h'])
    this.ctx.fillStyle = nodeType.backgroundColor
    this.ctx.shadowColor = 'rgba(0,0,0,0.22)'
    this.ctx.shadowBlur = 1
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 1
    this.ctx.fill()
    this.ctx.restore()
    return Promise.resolve({node, nodeType})
  }

  drawIcon ({node, nodeType}) {
    return new Promise((resolve, reject) => {
      var img = new Image(20, 20)
      img.onload = (e) => {
        this.ctx.drawImage(img, node.x+7, node.y+5, 20, 20)
        resolve({node, nodeType})
      }
      img.src = nodeType.icon
    })
  }

  drawLabel ({node, nodeType}) {
    this.ctx.font = '16px Arial'
    this.ctx.fillStyle = nodeType.fontColor
    this.ctx.fillText("Messages", node.x+35, node.y+20)
    return Promise.resolve({node, nodeType})
  }

  addNode (node) {
    const nodeType = this.store.nodeTypes[node.flowNodeTypeSlug]
    this.drawRect({node, nodeType})
      .then(this.drawIcon.bind(this))
      .then(this.drawLabel.bind(this))
  }

  removeNode () {
  }
}
