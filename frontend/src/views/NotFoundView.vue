<template>
    <div class=" flex flex-col gap-8 text-center items-center min-h-screen">
        <div class=" mt-12">
            <img src="../assets/not-found.png" width="400" alt="">
        </div>

        <div class=" space-y-2">
            <p class=" text-3xl font-bold">Yolunu mu kaybettin ?</p>
            <RouterLink to="/" type="button" class="btn btn-neutral btn-outline">
                Eve Dön<svgIconVue type="mdi" :path="mdiHome"></svgIconVue>
            </RouterLink>
        </div>
    </div>
</template>
<script setup>
import svgIconVue from '@jamescoyle/vue-icon';
import { mdiHome } from '@mdi/js';
</script>