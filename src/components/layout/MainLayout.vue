<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ActivityBar from './ActivityBar.vue'
import Sidebar from './Sidebar.vue'
import Toolbar from './Toolbar.vue'
import BottomPanel from '../editor/BottomPanel.vue'

const route = useRoute()

const activeActivity = ref('workflow')
const sidebarVisible = ref(true)

function onActivitySelect(id: string) {
  if (id === activeActivity.value && id !== 'settings') {
    // Toggle sidebar if same icon clicked
    sidebarVisible.value = !sidebarVisible.value
  } else {
    sidebarVisible.value = id !== 'settings'
    activeActivity.value = id
  }
}

// Sync active activity from route
watch(
  () => route.path,
  (path) => {
    if (path === '/settings') {
      activeActivity.value = 'settings'
      sidebarVisible.value = false
    } else if (path === '/') {
      activeActivity.value = 'workflow'
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden">
    <ActivityBar :active-id="activeActivity" @select="onActivitySelect" />
    <Sidebar :active-id="activeActivity" :visible="sidebarVisible" />
    <div class="flex flex-1 flex-col overflow-hidden">
      <Toolbar />
      <div class="flex flex-1 flex-col overflow-hidden">
        <main class="flex-1 overflow-hidden">
          <router-view />
        </main>
        <BottomPanel v-if="route.path !== '/settings'" />
      </div>
    </div>
  </div>
</template>
