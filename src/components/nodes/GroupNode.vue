<script setup lang="ts">
import { NodeResizer } from '@vue-flow/node-resizer'
import '@vue-flow/node-resizer/dist/style.css'

defineProps<{
  data: {
    label?: string
    color?: string
  }
}>()
</script>

<template>
  <div
    class="node-group"
    :style="{
      borderColor: data.color || '#64748b',
      minWidth: '200px',
      minHeight: '120px',
    }"
  >
    <NodeResizer color="transparent" />
    <div class="group-header" :style="{ color: data.color || '#64748b' }">
      {{ data.label || '分组' }}
    </div>
  </div>
</template>

<style scoped>
.node-group {
  width: 100%;
  height: 100%;
  border: 2px dashed;
  border-radius: 8px;
  background: rgba(100, 116, 139, 0.05);
  position: relative;
}
.group-header {
  position: absolute;
  top: -10px;
  left: 12px;
  font-size: 11px;
  font-weight: 600;
  background: var(--color-surface);
  padding: 0 6px;
}
</style>
