<template>
    <div class="max-w-[413px] flex flex-col justify-center p-4 mx-auto mt-32 bg-[#1C1C1C] bg-opacity-70 backdrop-blur text-white md:p-8 rounded-lg">
      <h1 class="text-[40px] font-bold mb-5">Sign Up</h1>
      <BaseForm @submit="handleSubmit">
        <div class="mb-8">
          <label for="name" class="block mb-2">Name</label>
          <BaseInput
            v-model="form.name"
            type="text"
            name="name"
            placeholder="Enter your name"
            required
          />
        </div>
        <div class="mb-8">
          <label for="email" class="block mb-2">Email</label>
          <BaseInput
            v-model="form.email"
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block mb-2">Password</label>
          <BaseInput
            v-model="form.password"
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <p v-if="error" class="text-red-500 text-center my-6">{{ error }}</p>
        <div class="text-right">
          <BaseButton text="Sign Up" class="mt-8 px-10 bg-gradient-to-l" />
        </div>
      </BaseForm>
      <p class="mt-6">Already a member ? <Span @click="router.push('/sign-in')" class="text-blue-500 ml-2 hover:cursor-pointer">Sign In</Span></p>
    </div>
  </template>
      
  <script lang="ts" setup>
    import { ref } from 'vue'
    import BaseButton from "../components/BaseButton.vue";
    import BaseInput from '../components/BaseInput.vue';
    import BaseForm from '../components/BaseForm.vue'
    import { useRouter } from 'vue-router';
    import { useFetch } from '@/composables/useFetch';
  
    const router = useRouter()
    const error = ref('')
    const form = ref({
        name: '',
        email: '',
        password: '',
        role: 'user'
    })
    
    const handleSubmit = async () => {
        try {
          const response = await useFetch('/auth', '', {
            method: 'POST',
            body: JSON.stringify(form.value)
          })
          if (response.status === 201) {
            router.push('/sign-in')
          }
        } catch(e: any) {
          error.value = e.message
        }
    }
  </script>
        