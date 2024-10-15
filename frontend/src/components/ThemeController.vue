<template>
    <label class="btn btn-ghost btn-circle swap swap-rotate">
        <input type="checkbox" class="theme-controller" value="light" />
        <SvgIcon class="swap-off" type="mdi" :path="mdiWhiteBalanceSunny"></SvgIcon>
        <SvgIcon class="swap-on" type="mdi" :path="mdiWeatherNight"></SvgIcon>
    </label>
</template>

<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiWhiteBalanceSunny, mdiWeatherNight } from '@mdi/js'
</script>
