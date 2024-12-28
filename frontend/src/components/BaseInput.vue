<template>
    <input
      v-model="internalValue" 
      :type="type"
      :id="name"
      class="w-full pl-2 py-2 border text-black border-[#6C757D] rounded-md"
      :placeholder="placeholder"
      @input="handleInput"
    />
  </template>
  
  <script lang="ts" setup>
  import { ref, watch } from 'vue';
  const props = defineProps<{
    placeholder: string
    type: string
    name: string
    modelValue?: string | number
  }>()
  
  const internalValue = ref(props.modelValue);  // Internal reactive value
  
  // Watch for changes in modelValue prop and update internal value
  watch(() => props.modelValue, (newValue) => {
    internalValue.value = newValue;
  });
  
  // Emit changes to the parent component
  const emit = defineEmits<{
    (e: 'update:modelValue'): void
  }>()
  
  const updateValue = (value: any) => {
    internalValue.value = value;
    emit('update:modelValue', value);  // Emit the updated value
  };
  
  // Listen to input events and update value
  const handleInput = (event: any) => {
    updateValue(event.target.value);
  };
  </script>
  
  <style scoped>
  /* Optional custom styles */
  </style>
  