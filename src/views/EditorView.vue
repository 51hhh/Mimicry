<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import { useWorkflowStore } from '../stores/workflow'
import ActionNode from '../components/nodes/ActionNode.vue'
import ConditionNode from '../components/nodes/ConditionNode.vue'
import LoopNode from '../components/nodes/LoopNode.vue'
import GroupNode from '../components/nodes/GroupNode.vue'
import PropertyPanel from '../components/editor/PropertyPanel.vue'

const store = useWorkflowStore()
const { onConnect, addEdges, onPaneReady, onNodeClick, onPaneClick } = useVueFlow()

onConnect((params) => {
  addEdges([params])
})

onPaneReady((instance) => {
  instance.fitView()
})

onNodeClick(({ node }) => {
  store.selectNode(node.id)
})

onPaneClick(() => {
  store.selectNode(null)
})

function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
}

function onDrop(event: DragEvent) {
  const type = event.dataTransfer?.getData('application/mimicry-node')
  if (!type) return

  const action = event.dataTransfer?.getData('application/mimicry-action') || ''

  const bounds = (event.target as HTMLElement).closest('.vue-flow')?.getBoundingClientRect()
  if (!bounds) return

  const position = {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  }

  const dataMap: Record<string, Record<string, unknown>> = {
    action: { action: action || 'Click', selector: '' },
    condition: { condition: 'exists', selector: '' },
    loop: { loopType: 'count', count: 5 },
    group: { label: '新分组', color: '#64748b' },
  }

  store.addNode(type, position, dataMap[type] || {})
}
</script>

<template>
  <div class="flex h-full">
    <!-- Canvas -->
    <div class="flex-1" @drop="onDrop" @dragover="onDragOver">
      <VueFlow
        v-model:nodes="store.nodes"
        v-model:edges="store.edges"
        :default-viewport="{ zoom: 1 }"
        fit-view-on-init
        class="h-full editor-canvas"
      >
        <template #node-action="props">
          <ActionNode v-bind="props" />
        </template>
        <template #node-condition="props">
          <ConditionNode v-bind="props" />
        </template>
        <template #node-loop="props">
          <LoopNode v-bind="props" />
        </template>
        <template #node-group="props">
          <GroupNode v-bind="props" />
        </template>
        <Background />
        <Controls />
        <MiniMap />
      </VueFlow>
    </div>

    <!-- Property Panel -->
    <PropertyPanel />
  </div>
</template>
