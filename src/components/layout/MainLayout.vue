<script setup lang="ts">
import Sidebar from "./Sidebar.vue";
import Toolbar from "./Toolbar.vue";
import BottomPanel from "../editor/BottomPanel.vue";
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden">
    <Sidebar />
    <div class="flex flex-1 flex-col overflow-hidden">
      <Toolbar />
      <div class="flex flex-1 flex-col overflow-hidden">
        <main class="flex-1 overflow-hidden">
          <router-view />
        </main>
        <BottomPanel />
      </div>
    </div>
  </div>
</template>
