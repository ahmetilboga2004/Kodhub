<template>
    <!-- Profile Card -->
    <div class="card bg-base-200 mb-8">
        <div class="card-body items-center text-center md:items-start md:text-start">
            <div class=" flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-6 ">
                <div class="avatar mb-4">
                    <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src="https://i.pravatar.cc/150?img=3" alt="Profile Picture" />
                    </div>
                </div>
                <div>
                    <h2 class="text-2xl font-bold">{{ projectStore.profile.firstName }} {{ projectStore.profile.lastName
                        }}</h2>
                    <span class=" font-mono">@{{ projectStore.profile.username }}</span>
                    <p class=" mt-2">{{ projectStore.profile.title }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class=" mb-8">
        <div class="card bg-base-200">
            <div class="card-body">
                <h2 class="card-title">Sosyal Medya</h2>
                <div class=" flex gap-4 flex-wrap">
                    <a type="link" class=" flex gap-1 font-mono text-pink-600 link link-hover">
                        <svgIconVue type="mdi" :path="mdiInstagram"></svgIconVue>ahmet_ilboga47
                    </a>
                    <a type="link" class=" flex gap-1 font-mono text-blue-600 link link-hover">
                        <svgIconVue type="mdi" :path="mdiFacebook"></svgIconVue>ahmet_ilboga47
                    </a>
                    <a type="link" class=" flex gap-1 font-mono text-green-500 link link-hover">
                        <svgIconVue type="mdi" :path="mdiEmail"></svgIconVue>ilbogaahmet4747@gmail.com
                    </a>
                    <a type="link" class=" flex gap-1 font-mono text-orange-600 link link-hover">
                        <svgIconVue type="mdi" :path="mdiReddit"></svgIconVue>ahmet_ilboga2004
                    </a>
                    <a type="link" class=" flex gap-1 font-mono text-blue-400 link link-hover">
                        <svgIconVue type="mdi" :path="mdiTwitter"></svgIconVue>ahmet_ilboga47
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div v-if="projectStore.profile.biography" class=" card bg-base-200 mb-8">
        <div class="card-body">
            <h2 class="card-title">Hakkında</h2>
            <p>{{ projectStore.profile.biography }}</p>
        </div>
    </div>
    <div class="mb-8">
        <div class="card bg-base-200">
            <div class="card-body">
                <div class="flex items-center justify-between">
                    <h2 class=" card-title">Projeler</h2>
                    <RouterLink :to="{ name: 'user.projects', params: { username: projectStore.profile.username } }"
                        class=" btn btn-xs md:btn-sm btn-outline btn-neutral">
                        Tüm Projelere Bak <svgIconVue type="mdi" size="16" :path="mdiOpenInNew"></svgIconVue>
                    </RouterLink>
                </div>
                <div v-if="projectStore.profile.projects && projectStore.profile.projects.length > 0" class="mt-2">
                    <div v-for="project in projectStore.profile.projects" :key="project.id"
                        class=" border-b border-b-neutral p-4">
                        <div class=" flex flex-col">
                            <RouterLink :to="{ name: 'projects.details', params: { id: project.id } }"
                                class=" md:text-lg font-bold">{{ project.title }}</RouterLink>
                            <span class=" text-slate-500 text-xs">{{ format(project.createdAt, "dd/MM/yyyy HH:mm")
                                }}</span>
                        </div>
                        <p class="line-clamp-4 text-pretty text-sm mt-2">
                            {{ project.desc }}
                        </p>
                    </div>
                </div>
                <div v-else role="alert" class="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        class="stroke-info h-6 w-6 shrink-0">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span v-if="authStore.authUser">
                        Henüz bir proje oluştur{{ projectStore.profile.id === authStore.authUser.id ? 'madın' : 'madı'
                        }}
                    </span>
                    <span v-else>
                        Henüz bir proje oluşturmadı
                    </span>

                </div>
            </div>
        </div>
    </div>

    <div>
        <div class="card bg-base-200">
            <div class="card-body">
                <div class="flex items-center justify-between">
                    <h2 class=" card-title">Katıldığı Projeler</h2>
                    <RouterLink
                        :to="{ name: 'user.projects.joined', params: { username: projectStore.profile.username } }"
                        class=" btn btn-xs md:btn-sm btn-outline btn-neutral">
                        Tüm Projelere Bak <svgIconVue type="mdi" size="16" :path="mdiOpenInNew"></svgIconVue>
                    </RouterLink>
                </div>
                <div v-if="projectStore.profile.joinedProjects && projectStore.profile.joinedProjects.length > 0"
                    class="mt-2">
                    <div v-for="project in projectStore.profile.joinedProjects" :key="project.id"
                        class="border-b border-b-neutral p-4">
                        <div class=" flex flex-col">
                            <RouterLink :to="{ name: 'projects.details', params: { id: project.id } }"
                                class=" md:text-lg font-bold">{{ project.title }}</RouterLink>
                            <span class=" text-slate-500 text-sm">{{ format(project.createdAt, "dd/MM/yyyy HH:mm")
                                }}</span>
                        </div>
                        <p class="line-clamp-4 text-pretty text-sm">
                            {{ project.desc }}
                        </p>
                    </div>
                </div>
                <div v-else role="alert" class="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        class="stroke-info h-6 w-6 shrink-0">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span v-if="authStore.authUser">Herhangi bir projeye katılma{{ projectStore.profile.id ===
                        authStore.authUser.id ? "dın" : "dı"
                        }}</span>
                    <span v-else>Herhangi bir projeye katılmadı</span>

                </div>
            </div>
        </div>
    </div>


</template>
<script setup>
import svgIconVue from '@jamescoyle/vue-icon';
import { mdiOpenInNew, mdiInstagram, mdiFacebook, mdiEmail, mdiReddit, mdiTwitter } from '@mdi/js';
import { useProjectStore } from '@/stores/project';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { format } from 'date-fns';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()
const route = useRoute()

const projectStore = useProjectStore()

onMounted(() => {
    projectStore.getProfile(route.params.username)
})
</script>
