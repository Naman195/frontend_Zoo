<template>
  <div
    class="cursor-pointer group relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-80 hover:shadow-lg transition-shadow duration-300 max-h-[600px] overflow-hidden"
  >
    <div class="relative h-50 m-2.5 overflow-hidden text-white rounded-md">
      <img
        class="transition-transform duration-500 ease-[cubic-bezier(0.25, 1, 0.5, 1)] transform group-hover:scale-110 w-full h-full object-cover"
        src="https://images.unsplash.com/photo-1496436818536-e239445d3327?q=80&w=1200"
        alt="investment-seed-round"
      />
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
