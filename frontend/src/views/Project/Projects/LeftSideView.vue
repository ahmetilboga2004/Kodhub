<template>
    <div class="card bg-base-200">
        <div class=" card-body">

            <h3 class="card-title">Filtreler</h3>

            <div class="form-control mb-4">
                <label class="label">
                    <span class="label-text">Arama</span>
                </label>
                <input type="text" v-model="localFilters.search" @input="debounceSearch" placeholder="Proje ara..."
                    class="input input-bordered w-full" />
            </div>

            <div class="form-control">
                <label class="label">
                    <span class="label-text">Proje Durumu</span>
                </label>
                <select v-model="localFilters.status" @change="applyFilters" class="select select-bordered w-full">
                    <option value="open">Açık</option>
                    <option value="partial filled">Kısmen Dolu</option>
                    <option value="filled">Dolu</option>
                    <option value="in progress">Devam Ediyor</option>
                    <option value="complated">Tamamlandı</option>
                    <option value="suspended">Askıya Alındı</option>
                </select>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useProjectStore } from '@/stores/project'
import debounce from 'lodash/debounce'

const projectStore = useProjectStore()

const localFilters = ref({ ...projectStore.filters })

const debounceSearch = debounce(() => {
    applyFilters()
}, 300)

function applyFilters() {
    projectStore.updateFilters(localFilters.value)
}

watch(() => projectStore.filters, (newFilters) => {
    localFilters.value = { ...newFilters }
}, { deep: true })
</script>