<template>
    <form @submit="onSubmit">
        <slot />
    </form>
</template>
<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'submit'): void
}>()

const onSubmit = (e: Event) => {
    e.preventDefault()
    emit('submit')
}
</script>