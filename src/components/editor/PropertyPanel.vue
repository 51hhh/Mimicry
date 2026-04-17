<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useWorkflowStore } from '../../stores/workflow'

const store = useWorkflowStore()
const activeTab = ref<'settings' | 'data'>('settings')

const node = computed(() => store.selectedNode)
const nodeType = computed(() => node.value?.type || '')

// Local editable copy of node data
const editData = ref<Record<string, unknown>>({})

watch(
  () => node.value,
  (n) => {
    if (n) {
      editData.value = { ...n.data }
    } else {
      editData.value = {}
    }
  },
  { immediate: true, deep: true }
)

function updateField(field: string, value: unknown) {
  editData.value[field] = value
  if (node.value) {
    store.updateNodeData(node.value.id, { [field]: value })
  }
}

// Action type options based on block-system.md
const actionTypes = [
  { group: '浏览器操作', items: ['Navigate', 'NewTab', 'SwitchTab', 'CloseTab', 'GoBack', 'GoForward', 'Reload', 'HandleDialog'] },
  { group: '页面交互', items: ['Click', 'Type', 'Hover', 'PressKey', 'Scroll', 'SelectOption', 'UploadFile', 'Clear', 'Focus'] },
  { group: '数据处理', items: ['GetText', 'GetAttribute', 'GetURL', 'Screenshot', 'ExtractTable', 'SetVariable', 'Export'] },
  { group: '高级', items: ['RunScript', 'HttpRequest', 'Log', 'Delay', 'Comment'] },
]

const loopTypes = [
  { value: 'count', label: '固定次数' },
  { value: 'items', label: '遍历元素' },
  { value: 'while', label: '条件循环' },
]

const conditionTypes = [
  { value: 'exists', label: '元素存在' },
  { value: 'not_exists', label: '元素不存在' },
  { value: 'visible', label: '元素可见' },
  { value: 'text_contains', label: '文本包含' },
  { value: 'url_contains', label: 'URL 包含' },
  { value: 'expression', label: '表达式' },
]

const onErrorOptions = [
  { value: 'stop', label: '停止执行' },
  { value: 'continue', label: '继续下一步' },
  { value: 'retry', label: '重试' },
]
</script>

<template>
  <aside class="property-panel">
    <!-- Empty state -->
    <div v-if="!node" class="empty-state">
      <div class="text-sm text-[var(--color-text-muted)]">选中节点查看属性</div>
    </div>

    <!-- Node properties -->
    <template v-else>
      <!-- Header -->
      <div class="panel-header">
        <div class="flex items-center gap-2">
          <span
            class="w-3 h-3 rounded-sm"
            :class="{
              'bg-blue-600': nodeType === 'action',
              'bg-amber-600': nodeType === 'condition',
              'bg-purple-600': nodeType === 'loop',
              'bg-emerald-600': nodeType === 'group',
            }"
          />
          <span class="font-semibold text-sm capitalize">{{ nodeType }}</span>
          <span class="text-xs text-[var(--color-text-muted)]">{{ node.id }}</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tab-bar">
        <button
          :class="['tab-btn', activeTab === 'settings' && 'active']"
          @click="activeTab = 'settings'"
        >
          设置
        </button>
        <button
          :class="['tab-btn', activeTab === 'data' && 'active']"
          @click="activeTab = 'data'"
        >
          数据
        </button>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="panel-body">
        <!-- Action Node -->
        <template v-if="nodeType === 'action'">
          <div class="field-group">
            <label class="field-label">动作类型</label>
            <select
              class="field-input"
              :value="editData.action"
              @change="updateField('action', ($event.target as HTMLSelectElement).value)"
            >
              <optgroup v-for="group in actionTypes" :key="group.group" :label="group.group">
                <option v-for="item in group.items" :key="item" :value="item">{{ item }}</option>
              </optgroup>
            </select>
          </div>

          <div class="field-group">
            <label class="field-label">元素选择器</label>
            <input
              type="text"
              class="field-input"
              placeholder="#selector 或 text=..."
              :value="editData.selector"
              @input="updateField('selector', ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div
            v-if="['Type', 'SelectOption'].includes(String(editData.action))"
            class="field-group"
          >
            <label class="field-label">输入值</label>
            <input
              type="text"
              class="field-input"
              placeholder="要输入的文本或 {{$var.name}}"
              :value="editData.value"
              @input="updateField('value', ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div v-if="editData.action === 'Navigate'" class="field-group">
            <label class="field-label">URL</label>
            <input
              type="text"
              class="field-input"
              placeholder="https://..."
              :value="editData.url"
              @input="updateField('url', ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div class="field-group">
            <label class="field-label">超时 (ms)</label>
            <input
              type="number"
              class="field-input"
              placeholder="5000"
              :value="editData.timeout"
              @input="updateField('timeout', Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </template>

        <!-- Condition Node -->
        <template v-if="nodeType === 'condition'">
          <div class="field-group">
            <label class="field-label">条件类型</label>
            <select
              class="field-input"
              :value="editData.condition"
              @change="updateField('condition', ($event.target as HTMLSelectElement).value)"
            >
              <option v-for="opt in conditionTypes" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div class="field-group">
            <label class="field-label">选择器</label>
            <input
              type="text"
              class="field-input"
              placeholder="#element"
              :value="editData.selector"
              @input="updateField('selector', ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div
            v-if="['text_contains', 'url_contains', 'expression'].includes(String(editData.condition))"
            class="field-group"
          >
            <label class="field-label">匹配值</label>
            <input
              type="text"
              class="field-input"
              placeholder="匹配文本或表达式"
              :value="editData.matchValue"
              @input="updateField('matchValue', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </template>

        <!-- Loop Node -->
        <template v-if="nodeType === 'loop'">
          <div class="field-group">
            <label class="field-label">循环类型</label>
            <select
              class="field-input"
              :value="editData.loopType"
              @change="updateField('loopType', ($event.target as HTMLSelectElement).value)"
            >
              <option v-for="opt in loopTypes" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div v-if="editData.loopType === 'count'" class="field-group">
            <label class="field-label">循环次数</label>
            <input
              type="number"
              class="field-input"
              placeholder="10"
              :value="editData.count"
              @input="updateField('count', Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <div v-if="editData.loopType === 'items'" class="field-group">
            <label class="field-label">元素选择器</label>
            <input
              type="text"
              class="field-input"
              placeholder=".list-item"
              :value="editData.selector"
              @input="updateField('selector', ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div v-if="editData.loopType === 'while'" class="field-group">
            <label class="field-label">条件表达式</label>
            <input
              type="text"
              class="field-input"
              placeholder="{{$var.hasNext}}"
              :value="editData.condition"
              @input="updateField('condition', ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div class="field-group">
            <label class="field-label">循环变量名</label>
            <input
              type="text"
              class="field-input"
              placeholder="item"
              :value="editData.variable"
              @input="updateField('variable', ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div class="field-group">
            <label class="field-label">最大迭代</label>
            <input
              type="number"
              class="field-input"
              placeholder="100"
              :value="editData.max"
              @input="updateField('max', Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </template>

        <!-- Group Node -->
        <template v-if="nodeType === 'group'">
          <div class="field-group">
            <label class="field-label">分组名称</label>
            <input
              type="text"
              class="field-input"
              placeholder="分组名称"
              :value="editData.label"
              @input="updateField('label', ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div class="field-group">
            <label class="field-label">颜色</label>
            <div class="flex gap-2">
              <button
                v-for="color in ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7', '#64748b']"
                :key="color"
                class="w-6 h-6 rounded border-2 transition-all"
                :class="editData.color === color ? 'border-white scale-110' : 'border-transparent'"
                :style="{ background: color }"
                @click="updateField('color', color)"
              />
            </div>
          </div>
        </template>

        <!-- Common: Error handling -->
        <div class="divider" />
        <div class="field-group">
          <label class="field-label">错误处理</label>
          <select
            class="field-input"
            :value="editData.onError || 'stop'"
            @change="updateField('onError', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="opt in onErrorOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div v-if="editData.onError === 'retry'" class="field-group">
          <label class="field-label">重试次数</label>
          <input
            type="number"
            class="field-input"
            placeholder="3"
            :value="editData.retryCount || 3"
            @input="updateField('retryCount', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <!-- Note -->
        <div class="field-group">
          <label class="field-label">备注</label>
          <textarea
            class="field-input resize-none"
            rows="2"
            placeholder="节点说明..."
            :value="editData.note as string"
            @input="updateField('note', ($event.target as HTMLTextAreaElement).value)"
          />
        </div>
      </div>

      <!-- Data Tab -->
      <div v-if="activeTab === 'data'" class="panel-body">
        <div class="text-xs text-[var(--color-text-muted)] mb-2">节点数据 (JSON)</div>
        <pre class="data-view">{{ JSON.stringify(node.data, null, 2) }}</pre>
      </div>
    </template>
  </aside>
</template>

<style scoped>
.property-panel {
  width: 280px;
  min-width: 280px;
  border-left: 1px solid var(--color-border);
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-header {
  padding: 10px 12px;
  border-bottom: 1px solid var(--color-border);
}

.tab-bar {
  display: flex;
  border-bottom: 1px solid var(--color-border);
}

.tab-btn {
  flex: 1;
  padding: 6px 0;
  font-size: 12px;
  color: var(--color-text-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
}

.tab-btn:hover {
  color: var(--color-text);
}

.tab-btn.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.field-group {
  margin-bottom: 12px;
}

.field-label {
  display: block;
  font-size: 11px;
  color: var(--color-text-muted);
  margin-bottom: 4px;
  font-weight: 500;
}

.field-input {
  width: 100%;
  padding: 6px 8px;
  font-size: 12px;
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  outline: none;
  transition: border-color 0.15s;
}

.field-input:focus {
  border-color: var(--color-primary);
}

select.field-input {
  cursor: pointer;
}

.divider {
  height: 1px;
  background: var(--color-border);
  margin: 12px 0;
}

.data-view {
  font-size: 11px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 8px;
  overflow: auto;
  max-height: 400px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
