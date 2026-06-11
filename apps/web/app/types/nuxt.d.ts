declare module '#app' {
  interface NuxtApp {
    $api: $Fetch;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: $Fetch;
  }
}

export {};
