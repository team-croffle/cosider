<template>
  <div class="flex min-h-screen flex-col">
    <LandingHeader />
    <UMain class="flex-1">
      <slot />
    </UMain>
    <USeparator />
    <LandingFooter />
  </div>
</template>

<script setup lang="ts"></script>
