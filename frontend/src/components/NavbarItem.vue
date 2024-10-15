<template>
    <nav class="navbar bg-base-300 w-full">
        <div class="navbar-start">
            <div class="flex-none lg:hidden">
                <label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        class="inline-block h-6 w-6 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </label>
            </div>
            <RouterLink :to="{ name: 'home' }">
                <button class="btn btn-ghost text-lg font-extrabold">KODHUB</button>
            </RouterLink>
        </div>

        <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal">
                <!-- Her zaman görünen Projects linki -->
                <li>
                    <RouterLink :to="{ name: 'projects' }" class="hover:bg-base-200 px-4 py-2 rounded-lg">
                        Projeler
                    </RouterLink>
                </li>

                <!-- Sadece giriş yapmış kullanıcılar için -->
                <li v-if="isFullyAuthenticated">
                    <RouterLink :to="{ name: 'projects.create' }" class="hover:bg-base-200 px-4 py-2 rounded-lg">
                        Oluştur
                    </RouterLink>
                </li>

                <!-- Sadece giriş yapmış kullanıcılar için -->
                <li v-if="isFullyAuthenticated">
                    <RouterLink :to="{
                        name: 'user.projects',
                        params: {
                            username: authStore.authUser?.username
                        }
                    }" class="hover:bg-base-200 px-4 py-2 rounded-lg">
                        Projelerim
                    </RouterLink>
                </li>
            </ul>
        </div>

        <div class="navbar-end">
            <ul class="menu menu-horizontal">
                <ThemeController />

                <!-- Kullanıcı giriş yapmışsa -->
                <template v-if="isFullyAuthenticated">
                    <div class="dropdown dropdown-end">
                        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                            <div class="w-10 rounded-full">
                                <img alt="User avatar"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                        <ul tabindex="0"
                            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li>
                                <RouterLink
                                    :to="{ name: 'user.profile', params: { username: authStore.authUser?.username } }"
                                    class="hover:bg-base-200">
                                    Profil
                                </RouterLink>
                            </li>
                            <li>
                                <a class="hover:bg-base-200">Ayarlar</a>
                            </li>
                            <li>
                                <a @click="handleLogout" class="hover:bg-base-200">Çıkış Yap</a>
                            </li>
                        </ul>
                    </div>
                </template>

                <!-- Kullanıcı giriş yapmamışsa -->
                <template v-else>
                    <li>
                        <RouterLink class="btn btn-ghost btn-circle hover:bg-base-200" :to="{ name: 'login' }">
                            <SvgIcon type="mdi" :path="mdiLogin" />
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink class="btn btn-ghost btn-circle hover:bg-base-200" :to="{ name: 'register' }">
                            <SvgIcon type="mdi" :path="mdiAccountPlus" />
                        </RouterLink>
                    </li>
                </template>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import apiClient from '@/services/axios'
import ThemeController from './ThemeController.vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiLogin, mdiAccountPlus } from '@mdi/js'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const { accessToken, authUser } = storeToRefs(authStore)

// Daha kapsamlı bir authentication kontrolü
const isFullyAuthenticated = computed(() => {
    return Boolean(accessToken.value) &&
        Boolean(authUser.value) &&
        Boolean(authUser.value?.username)
})

const handleLogout = async () => {
    try {
        await apiClient.get('/auth/logout')
        // LocalStorage temizliği store içinde yapılıyor
        authStore.clearAuth()
        toast.info('Başarılı bir şekilde çıkış yapıldı')
        router.push('/')
    } catch (error) {
        console.error(error)
        toast.error('Çıkış yapılırken bir hata oluştu')
    }
}
</script>