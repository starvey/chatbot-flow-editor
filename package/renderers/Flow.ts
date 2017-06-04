import { Store } from '../store'
import { FlowNode } from '../classes/FlowNode'
import { FlowNodeType } from '../classes/FlowNodeType'

export class FlowRenderer {
  baseElement: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  store: Store
  rectangleDragging: boolean = false
  elementsBox: object = {
    h: 31,
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
      const isMouseInRect = this.isMouseInRect(this.getMousePosition(event))
      if (isMouseInRect) {
        this.rectangleDragStart()
      }
    })

    $canvas.addEventListener('mouseup', (event) => {
      this.rectangleDragStop()
    })

    $canvas.addEventListener('mouseleave', (event) => {
      this.rectangleDragStop()
    })

    $canvas.addEventListener('mousemove', (event) => {
      if(this.rectangleDragging) {
        this.onRectangleDrag(event)
      }
    })
  }

  onRectangleDrag(event: MouseEvent) {
    console.log(this.getMousePosition(event))
  }

  rectangleDragStart() {
    this.rectangleDragging = true
  }

  rectangleDragStop() {
    this.rectangleDragging = false
  }

  getMousePosition(event: MouseEvent) {
    return {
      x: event.clientX - this.canvasRect.left,
      y: event.clientY - this.canvasRect.top
    }
  }

  isMouseInRect({x, y}) {
    return Object.keys(this.store.nodes).map(k => this.store.nodes[k]).filter((node: FlowNode) => {
      return  node.x < x &&
              (node.x + this.elementsBox['w']) > x &&
              node.y < y &&
              (node.y + this.elementsBox['h']) > y
    }).length > 0
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

  addNodes (nodes: Array<FlowNode>) {
    this.ctx.clearRect(0, 0, this.canvasRect.width, this.canvasRect.height);
    nodes.forEach((node) => {
      const nodeType = this.store.nodeTypes[node.flowNodeTypeSlug]
      this.drawRect({node, nodeType})
        .then(this.drawIcon.bind(this))
        .then(this.drawLabel.bind(this))
    })
  }
}
