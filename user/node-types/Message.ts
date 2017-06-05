import { FlowNodeType } from '../../package/classes/FlowNodeType'
import { FlowNode } from '../../package/classes/FlowNode'

export class MessageNodeType extends FlowNodeType {
  slug = "message-node"
  name = "Message"
  icon = "http://www.shopspringbreak.com/skin/frontend/default/theme706/fonts/general-ui/svg/message31.svg"
  backgroundColor = 'rgba(222, 231, 231, 1)'
  fontColor = 'rgba(83, 86, 87, 1)'
  createNewInstance ({x, y}) {
    return new MessageNode({
      flowNodeTypeSlug: this.slug,
      x,
      y
    })
  }

  generateMainFormHTML(node: FlowNode) {
    const form = document.createElement('div')
    form.innerHTML = `
      <div class="form__row">
        <div class="form__label">Name</div>
        <div class="form__field">
          <input type="text" name="name" />
        </div>
      </div>
    `

    form.querySelector('.form__field').addEventListener('click', () => {
      console.log('Field clicked')
    })

    return form
  }

  generatePortFormHTML (node: FlowNode, linkedNode: FlowNode) {
    const form = document.createElement('div')
    form.innerHTML = `
      <div class="form__row">
        <div class="form__label">Condition</div>
        <div class="form__textarea">
          <textarea type="text" name="condition"></textarea>
        </div>
      </div>
    `

    form.querySelector('.form__textarea').addEventListener('click', () => {
      console.log('Textarea clicked')
    })

    return form
  }
}

export class MessageNode extends FlowNode {
  message: string
}