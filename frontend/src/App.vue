<script setup>
import Navbar from './components/NavbarItem.vue'
import Sidebar from './components/SidebarItem.vue'
import Footer from './components/FooterItem.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
const route = useRoute()
const layoutType = computed(() => route.meta?.layout?.full ?? false)
</script>
<template>
    <div class="drawer">
        <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col">
            <header>
                <Navbar></Navbar>
            </header>

            <!-- İLGİLİ LAYOUT KODLARI BURASI DİĞER TEMPLATE KODLARINA KARIŞMA -->
            <div class="container mx-auto py-2 px-2 sm:px-4 lg:py-6 min-h-screen">
                <div :class="layoutType === false ? 'lg:grid-cols-12' : ''" class="grid grid-cols-1 gap-4">
                    <aside v-if="layoutType === false" class="lg:col-span-3">
                        <RouterView name="left"></RouterView>
                        <!-- Sol sütun -->
                    </aside>

                    <main :class="layoutType === false ? 'lg:col-span-6' : 'lg:col-span-12'" class="lg:order-none">
                        <RouterView></RouterView>
                        <!-- Orta sütun -->
                    </main>

                    <aside v-if="layoutType === false" class="lg:col-span-3">
                        <RouterView name="right"></RouterView>
                        <!-- Sağ sütun -->
                    </aside>
                </div>
            </div>

            <Footer></Footer>
        </div>
        <Sidebar></Sidebar>
    </div>
</template>
