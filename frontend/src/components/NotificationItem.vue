<template>
    <div class="dropdown dropdown-end z-50">
        <label tabindex="0" class="btn btn-ghost btn-circle">
            <div class="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="badge badge-sm indicator-item" v-if="notifications.length">{{ notifications.length
                    }}</span>
            </div>
        </label>
        <div tabindex="0" class="mt-3 card card-compact dropdown-content w-80 bg-base-100 shadow">
            <div class="card-body">
                <span class="font-bold text-lg">Bildirimler</span>
                <div v-if="notifications.length === 0" class="text-info">Yeni bildirim yok</div>
                <ul class="menu bg-base-100 w-full p-0">
                    <li v-for="notification in notifications" :key="notification.id">
                        <a @click="goToProject(notification.url)" class="py-2 hover:bg-base-200">
                            {{ notification.message }}
                        </a>
                    </li>
                </ul>
                <div class="card-actions">
                    <button class="btn btn-neutral btn-sm btn-block" @click="clearNotifications">
                        <svgIconVue type="mdi" :path="mdiEyeCheckOutline"></svgIconVue> Okundu
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import svgIconVue from '@jamescoyle/vue-icon';
import { mdiEyeCheckOutline } from '@mdi/js';


const authStore = useAuthStore()
const router = useRouter();
const notifications = ref([]);
let eventSource;

const goToProject = (url) => {
    if (url) {
        router.push(url);
    }
};

const clearNotifications = () => {
    notifications.value = [];
};

onMounted(() => {
    const userId = authStore.authUser.id

    eventSource = new EventSource(`http://localhost:4000/api/events?userId=${userId}`);

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("event soruce data:", data)
        notifications.value.push({
            id: Date.now(),
            message: data.message,
            url: data.url
        });
    };

    eventSource.onerror = (error) => {
        console.error('SSE bağlantı hatası:', error);
        eventSource.close();
    };
});

onUnmounted(() => {
    if (eventSource) {
        eventSource.close();
    }
});
</script>