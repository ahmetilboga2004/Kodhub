<template>
    <div class="flex justify-center" v-if="totalPages > 1">
        <div class="join mt-4">
            <button class="join-item btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
                «
            </button>

            <button v-for="page in visiblePages" :key="page" @click="changePage(page)"
                :class="['join-item btn', { 'btn-active': page === currentPage }]">
                {{ page }}
            </button>

            <button class="join-item btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
                »
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    },
    onPageChange: {
        type: Function,
        required: true
    }
})

console.log('Pagination props:', {
    currentPage: props.currentPage,
    totalPages: props.totalPages
})

const visiblePages = computed(() => {
    const { currentPage, totalPages } = props
    const pages = []
    const maxVisible = 5 // Gösterilecek maksimum sayfa sayısı

    if (totalPages <= maxVisible) {
        // Toplam sayfa sayısı az ise hepsini göster
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i)
        }
    } else {
        // Başlangıç ve bitiş sayfalarını hesapla
        let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1)
        let end = Math.min(start + maxVisible - 1, totalPages)

        // Başlangıç ve bitiş sayfalarını ayarla
        if (end === totalPages) {
            start = Math.max(end - maxVisible + 1, 1)
        }

        // Sayfaları ekle
        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        // Gerekirse başa ve sona üç nokta ekle
        if (start > 1) {
            pages.unshift(1)
            if (start > 2) pages.splice(1, 0, '...')
        }
        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...')
            pages.push(totalPages)
        }
    }

    return pages
})

const changePage = (page) => {
    if (typeof page === 'number' && page !== props.currentPage) {
        props.onPageChange(page)
    }
}
</script>