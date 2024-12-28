<template>
  <div class="max-w-[413px] flex flex-col justify-center p-4 mx-auto mt-32 bg-[#1C1C1C] bg-opacity-70 backdrop-blur text-white md:p-8 rounded-lg">
    <h1 class="text-[40px] font-bold mb-5">Sign In</h1>
    <BaseForm @submit="handleSubmit">
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
        <BaseButton text="Sign In" class="mt-8 px-10 bg-gradient-to-l" />
      </div>
    </BaseForm>
    <p class="mt-6">Not a member ? <Span @click="router.push('/sign-up')" class="text-blue-500 ml-2 hover:cursor-pointer">Create Account</Span></p>
  </div>
</template>
      
<script lang="ts" setup>
  import { ref } from 'vue'
  import BaseButton from "../components/BaseButton.vue";
  import BaseInput from '../components/BaseInput.vue';
  import BaseForm from '../components/BaseForm.vue'
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { useFetch } from '@/composables/useFetch';

  const authStore = useAuthStore()
  const { setLocalStore } = authStore
  const router = useRouter()
  const error = ref('')
  const form = ref({
    email: '',
    password: ''
  })
  
  const handleSubmit = async () => {
    try {
      const response = await useFetch('/auth/login', '', {
        method: 'POST',
        body: JSON.stringify(form.value)
      })
      if (response.status === 200) {
        authStore.isAdmin ? 
        router.push('/transactions') : router.push('/') 
        authStore.profile = { name: response.data.token.name, role: response.data.token.role}
        setLocalStore('profile', JSON.stringify(authStore.profile))
        setLocalStore('access_token', response.data.token.access_token)
      }
    } catch(e: any) {
      error.value = e.message
    }
  }

</script>
        