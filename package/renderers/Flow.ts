import { Store } from '../store'
import { FlowNode } from '../classes/FlowNode'
import { FlowNodeType } from '../classes/FlowNodeType'
import { FlowPort } from '../classes/FlowPort'

export class FlowRenderer {
  baseElement: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  store: Store
  rectangleDragging: FlowNode = null
  portLinking: FlowPort = null
  elementsBox: object = {
    h: 31,
    w: 260
  }
  get canvasRect () {
    return this.baseElement.getBoundingClientRect() // Perfo problem
  }

  constructor (store: Store) {
    this.store = store
    const $canvas = document.createElement('canvas')
    document.querySelector('.content__main-content').appendChild($canvas)
    $canvas.width = 4000
    $canvas.height = 4000
    $canvas.setAttribute('id', 'content-canvas')
    this.baseElement = $canvas
    this.ctx = $canvas.getContext('2d')

    $canvas.addEventListener('mousedown', (event) => {
      const mousePosition = this.getMousePosition(event)
      const mouseInRect = this.mouseInRect(mousePosition)

      if (mouseInRect) {
        if (event.shiftKey) {
          this.onNodeClick(mouseInRect)
        } else {
          this.dragStart(mousePosition, mouseInRect)
        } 
      } else {
        this.store.setCurrentPosition(mousePosition)
      }
    })

    $canvas.addEventListener('mouseup', (event) => {
      this.dragStop(event)
    })

    $canvas.addEventListener('mouseleave', (event) => {
      if (this.portLinking || this.rectangleDragging){
        this.dragStop(event)
      }
    })

    $canvas.addEventListener('mousemove', (event) => {
      const mousePosition = this.getMousePosition(event)
      const mouseInRect = this.mouseInRect(mousePosition)
      if (mouseInRect) {
        this.baseElement.style.cursor = 'pointer'
      } else {
        this.baseElement.style.cursor = ''
      }
      if (this.rectangleDragging) {
        this.onRectangleDrag(event)
      }
      if (this.portLinking) {
        this.onPortDrag(event)
      }
    })

    //this.canvasRect = this.canvasRectlive
  }

  onNodeClick(mouseInRect) {
    this.store.setSelectedNode(mouseInRect)
  }

  onPortDrag(event: MouseEvent) {
    const mousePosition = this.getMousePosition(event)
    this.portLinking.x = mousePosition.x
    this.portLinking.y = mousePosition.y
    this.store.registerNode(this.store.nodes[this.portLinking.from])
  }

  onRectangleDrag(event: MouseEvent) {
    const mousePosition = this.getMousePosition(event)
    const newXPosition = mousePosition.x - (this.elementsBox['w']/2)
    const newYPosition = mousePosition.y - (this.elementsBox['h']/2)
    this.rectangleDragging.x = newXPosition
    this.rectangleDragging.y = newYPosition
    this.store.registerNode(this.rectangleDragging)
  }

  dragStart(mousePosition, mouseInRect: FlowNode) {
    if ((mouseInRect.x + this.elementsBox['w']) - mousePosition.x <= 30){
      this.portLinking = new FlowPort()
      this.portLinking.from = mouseInRect.id
      mouseInRect.ports[this.portLinking.id] = this.portLinking
    } else {
      this.rectangleDragging = mouseInRect
    }
  }

  dragStop(event: MouseEvent) {
    if (this.portLinking) {
      const mousePosition = this.getMousePosition(event)
      const mouseInRect = this.mouseInRect(mousePosition)
      const fromNode = this.store.nodes[this.portLinking.from]
      const currentLinks = Object.keys(fromNode.ports).map((k) => {
        return fromNode.ports[k].linksTo
      })
      if (mouseInRect && fromNode.id !== mouseInRect.id && currentLinks.indexOf(mouseInRect.id) === -1) {
        fromNode.ports[this.portLinking.id].x = null
        fromNode.ports[this.portLinking.id].y = null
        fromNode.ports[this.portLinking.id].linksTo = mouseInRect.id
      } else {
        delete fromNode.ports[this.portLinking.id]
      }
      this.store.registerNode(fromNode)
    }
    this.rectangleDragging = null
    this.portLinking = null
  }

  getMousePosition(event: MouseEvent) {
    return {
      x: event.clientX - this.canvasRect.left,
      y: event.clientY - this.canvasRect.top
    }
  }

  mouseInRect({x, y}) {
    const offsetX = 15
    const offsetY = 5
    return Object.keys(this.store.nodes).map(k => this.store.nodes[k]).filter((node: FlowNode) => {
      return  node.x - offsetX <= x &&
              (node.x + offsetX + this.elementsBox['w']) >= x &&
              node.y - offsetY <= y &&
              (node.y + offsetY + this.elementsBox['h']) >= y
    })[0]
  }

  drawRect = (node, nodeType) => () => {
    this.ctx.beginPath()
    this.ctx.rect(node.x, node.y, this.elementsBox['w'], this.elementsBox['h'])
    this.ctx.fillStyle = nodeType.backgroundColor
    this.ctx.shadowColor = 'rgba(0,0,0,0.22)'
    this.ctx.shadowBlur = 1
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 1
    this.ctx.fill()
    this.ctx.closePath()
    return Promise.resolve({node, nodeType})
  }

  drawIcon = (node, nodeType) => () => {
    return new Promise((resolve, reject) => {
      this.ctx.beginPath()
      var img = new Image(20, 20)
      img.onload = (e) => {
        this.ctx.drawImage(img, node.x+7, node.y+5, 20, 20)
        this.ctx.closePath()
        resolve({node, nodeType})
      }
      img.src = nodeType.icon
    })
  }

  drawLabel = (node, nodeType) => () => {
    this.ctx.beginPath()
    this.ctx.font = '16px Arial'
    this.ctx.fillStyle = nodeType.fontColor
    this.ctx.fillText(node.name || nodeType.name, node.x+35, node.y+20)
    this.ctx.closePath()
    return Promise.resolve({node, nodeType})
  }

  drawDocks = (node, nodeType) => () => {
    const x = node.x + this.elementsBox['w']
    const y = node.y + this.elementsBox['h']/2
    this.ctx.beginPath()
    this.ctx.arc(x, y, 10, 0, 2 * Math.PI, false)
    this.ctx.fillStyle = nodeType.backgroundColor
    this.ctx.shadowColor = 'rgba(0,0,0,0.6)'
    this.ctx.shadowBlur = 2
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 0
    this.ctx.fill()
    this.ctx.closePath()
    return Promise.resolve()
  }

  drawPorts = (node, nodeType) => () => {
    const fromX = node.x + this.elementsBox['w']
    const fromY = node.y + this.elementsBox['h']/2
    Object.keys(node.ports).forEach((k) => {
      const port = node.ports[k]
      let toX
      let toY
      if (port.linksTo) {
        const linksToNode = this.store.nodes[port.linksTo]
        toX = linksToNode.x
        toY = linksToNode.y + this.elementsBox['h']/2
      } else {
        toX = port.x
        toY = port.y
      }
      this.ctx.beginPath()
      this.ctx.moveTo(fromX, fromY)
      this.ctx.lineTo(toX, toY)
      let gradient= this.ctx.createLinearGradient(fromX,fromY,toX,toY)
      gradient.addColorStop(0,"green")
      gradient.addColorStop(0.5, "yellow")
      gradient.addColorStop(1.0, "red")
      this.ctx.strokeStyle = gradient
      this.ctx.lineWidth = 3
      this.ctx.stroke()
      this.ctx.closePath()
    })
    return Promise.resolve()
  }

  addNodes (nodes: Array<FlowNode>) {
    this.ctx.clearRect(0, 0, this.canvasRect.width, this.canvasRect.height);
    nodes.reduce((agg, node) => { // perfo problem
      return agg.then(() => new Promise((resolve) => {
        const nodeType = this.store.nodeTypes[node.flowNodeTypeSlug]
        this.drawRect(node, nodeType)()
          //.then(this.drawIcon.bind(this))  // This sadly makes it blinks too much to be viable. Sad, sad.
          .then(this.drawLabel(node, nodeType))
          .then(this.drawDocks(node, nodeType))
          .then(this.drawPorts(node, nodeType))
          .then(() => resolve())
      }))
    }, Promise.resolve({}))
  }
}
