<template>
  <div
    class="group relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-80 hover:shadow-lg transition-shadow duration-300 max-h-[600px] overflow-hidden"
  >
    <div class="relative h-30 m-2.5 overflow-hidden text-white rounded-md">
     
      <slot name="card-image"></slot>
    </div>
    <div class="p-4">
      <h2>
        <slot name="card-title"></slot>
      </h2>
      <p>
        <slot name="card-subtitle"></slot>
      </p>
    </div>
    <div class="flex justify-around items-center px-4 pb-4 pt-0 mt-2 space-x-4">
      <slot name="card-action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
