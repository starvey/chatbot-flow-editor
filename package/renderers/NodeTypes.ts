import {FlowNodeType} from '../classes/FlowNodeType'
import 'd3'

export function addNodeType (nodeType: FlowNodeType) {
  const $list = document.querySelector('.side-bar__node-types')
  const $newNode = document.createElement('div')
  $newNode.innerHTML = `
    <img class="node-types__node-type__icon" src="${nodeType.icon}" />${nodeType.name}
  `

  $newNode.className = `node-types__node-type node-type__${nodeType.slug}`
  $newNode.style.backgroundColor = nodeType.backgroundColor
  $newNode.style.color = nodeType.fontColor

  $list.appendChild($newNode)
}

export function removeNodeType () {
}