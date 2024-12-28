<template>
    <button class="flex gap-x-4 from-[#48A54C] to-[#2D5E9B] px-6 py-3 item-center text-white text-lg rounded-2xl hover:cursor-pointer">
        <slot />
        {{ text }}
    </button>
</template>
<script lang="ts" setup>
defineProps<{
  text: string
}>()

</script>