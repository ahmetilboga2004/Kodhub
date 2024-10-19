<template>
    <div class="card bg-base-200 sticky top-4">
        <div class="card-body">
            <h3 class="card-title">Filtreler</h3>

            <!-- Arama Alanı -->
            <div class="form-control mb-4">
                <label class="label">
                    <span class="label-text">Arama</span>
                </label>
                <input type="text" v-model="localFilters.search" @input="debounceSearch" placeholder="Proje ara..."
                    class="input input-bordered w-full" />
            </div>

            <!-- Proje Durumu -->
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Proje Durumu</span>
                </label>
                <select v-model="localFilters.status" @change="applyFilters" class="select select-bordered w-full">
                    <option value="all">Tümü</option>
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
import { useRoute } from 'vue-router'

// Route'dan filterType'ı alıyoruz
const route = useRoute()
const filterType = ref(route.meta.filterType || 'all')  // Varsayılan olarak 'all'

// Pinia Store
const projectStore = useProjectStore()

// localFilters, store'dan alınan mevcut filtrelere dayanıyor
const localFilters = ref({ ...projectStore.filters[filterType.value] })

// Arama için debounce fonksiyonu
const debounceSearch = debounce(() => {
    applyFilters()
}, 300)

// Filtreleri uygulama fonksiyonu
function applyFilters() {
    projectStore.updateFilters(localFilters.value, filterType.value)
}

// Store'daki filtreler değiştiğinde localFilters'ı güncelle
watch(() => projectStore.filters[filterType.value], (newFilters) => {
    localFilters.value = { ...newFilters }
}, { deep: true })
</script>
