<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { computed } from 'vue'
import { useExecutionStore } from '../../stores/execution'

const props = defineProps<{
  id: string
  data: {
    condition: string
    selector?: string
  }
}>()

const execution = useExecutionStore()
const nodeStatus = computed(() => execution.getNodeStatus(props.id))
</script>

<template>
  <div class="node-condition" :class="`status-${nodeStatus}`">
    <div class="node-header bg-amber-600">IF</div>
    <div class="node-body">
      <div class="node-field">{{ data.condition || 'condition' }}</div>
      <div v-if="data.selector" class="node-field text-xs text-[var(--color-text-muted)]">{{ data.selector }}</div>
    </div>
    <Handle type="target" :position="Position.Top" />
    <Handle id="true" type="source" :position="Position.Bottom" :style="{ left: '30%' }" />
    <Handle id="false" type="source" :position="Position.Bottom" :style="{ left: '70%' }" />
  </div>
</template>

<style scoped>
.node-condition {
  min-width: 140px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  overflow: hidden;
  font-size: 12px;
}
.node-header {
  padding: 4px 8px;
  color: white;
  font-weight: 600;
  font-size: 11px;
}
.node-body {
  padding: 6px 8px;
}
</style>
