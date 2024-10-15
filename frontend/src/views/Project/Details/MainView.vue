<template>
    <div v-if="projectStore.isLoading && !projectStore.error" class="flex items-center justify-center min-h-screen">
        <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div v-else-if="projectStore.error" role="alert" class="alert alert-error">
        <span>{{ projectStore.error }}</span>
    </div>
    <div v-else-if="projectStore.project">
        <!-- Ana içerik alanı -->
        <div class="card bg-base-200">
            <div class="card-body">
                <h2 class="card-title text-2xl font-bold mb-4">
                    {{ projectStore.project.title }}
                </h2>
                <p class="mb-6">{{ projectStore.project.desc }}</p>
                <div>
                    <div class=" flex justify-between items-center">
                        <h3 class="font-semibold text-xl mb-4">Pozisyonlar</h3>
                        <span class=" badge badge-info">{{ projectStore.project.Positions.length }}</span>
                    </div>
                    <div class="space-y-4">
                        <div v-for="position in projectStore.project.Positions" :key="position.id" tabindex="0"
                            class="collapse collapse-arrow border-base-300 bg-base-200 border">
                            <input type="checkbox" />
                            <div class="collapse-title text-xl font-medium">
                                {{ position.title }} <span :class="{
                                    'badge-success': position.status === 'open',
                                    'badge-error': position.status === 'filled'
                                }" class=" badge badge-outline">{{
                                    positionStatusLabel(position.status) }}</span>
                            </div>
                            <div class="collapse-content">
                                <p>
                                    {{ position.desc }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project'

const projectStore = useProjectStore()

const route = useRoute()
const positionStatusLabel = (status) => {
    switch (status) {
        case 'open':
            return "Açık"
        case 'filled':
            return "Dolu"
    }
}


onMounted(() => {
    projectStore.getProjectDetails(route.params.id)
})
</script>
