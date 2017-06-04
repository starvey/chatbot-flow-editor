import { Store } from '../store'
import { FlowNode } from '../classes/FlowNode'
import { FlowNodeType } from '../classes/FlowNodeType'

export class FlowRenderer {
  baseElement: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  store: Store
  rectangleDragging: FlowNode = null
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
      const mousePosition = this.getMousePosition(event)
      const mouseInRect = this.mouseInRect(mousePosition)
      if (mouseInRect) {
        this.rectangleDragStart(mouseInRect)
      } else {
        this.store.setCurrentPosition(mousePosition)
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
    const mousePosition = this.getMousePosition(event)
    const newXPosition = mousePosition.x - (this.elementsBox['w']/2)
    const newYPosition = mousePosition.y - (this.elementsBox['h']/2)
    this.rectangleDragging.x = newXPosition
    this.rectangleDragging.y = newYPosition
    this.store.registerNode(this.rectangleDragging)

  }

  rectangleDragStart(mouseInRect: FlowNode) {
    this.rectangleDragging = mouseInRect
  }

  rectangleDragStop() {
    this.rectangleDragging = null
  }

  getMousePosition(event: MouseEvent) {
    return {
      x: event.clientX - this.canvasRect.left,
      y: event.clientY - this.canvasRect.top
    }
  }

  mouseInRect({x, y}) {
    return Object.keys(this.store.nodes).map(k => this.store.nodes[k]).filter((node: FlowNode) => {
      return  node.x < x &&
              (node.x + this.elementsBox['w']) > x &&
              node.y < y &&
              (node.y + this.elementsBox['h']) > y
    })[0]
  }

  drawRect ({node, nodeType}) {
    this.ctx.rect(node.x, node.y, this.elementsBox['w'], this.elementsBox['h'])
    this.ctx.fillStyle = nodeType.backgroundColor
    this.ctx.shadowColor = 'rgba(0,0,0,0.22)'
    this.ctx.shadowBlur = 1
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 1
    this.ctx.fill()
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
    nodes.reduce((agg, node) => {
      return agg.then(() => new Promise((resolve) => {
        const nodeType = this.store.nodeTypes[node.flowNodeTypeSlug]
        this.ctx.beginPath()
        this.drawRect({node, nodeType})
          //.then(this.drawIcon.bind(this))  // This sadly makes it blinks too much to be viable. Sad, sad.
          .then(this.drawLabel.bind(this))
          .then(() => this.ctx.closePath())
          .then(() => resolve())
      }))
    }, Promise.resolve({}))
  }
}
