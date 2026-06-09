<script setup lang="ts">
  import type { ICreateWorkspaceRequest } from '@cosider/shared';

  const isOpen = defineModel<boolean>({ default: false });

  const form = reactive<ICreateWorkspaceRequest>({
    name: '',
    slug: '',
    description: null,
    logoUrl: '',
  });

  const isSlugManuallyEdited = ref(false); // 사용자가 slug를 직접 수정했는지

  // name → slug 자동 변환
  watch(
    () => form.name,
    (newName) => {
      if (isSlugManuallyEdited.value) return; // 직접 수정했으면 자동변환 안함

      form.slug = newName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    },
  );

  // 모달 닫힐 때마다 초기화
  watch(isOpen, (newVal) => {
    if (!newVal) onClose();
  });

  // image upload
  // TODO: presigned URL → S3 업로드 연결 필요 (백엔드 완성 후)
  const fileInput = ref<HTMLInputElement | null>(null);
  const previewUrl = ref<string | null>(null);
  const fileError = ref<string | null>(null);

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  function onLogoClick() {
    fileInput.value?.click();
  }

  function onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // 파일 형식 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      fileError.value = '지원하지 않는 파일 형식입니다. (jpg, png, webp)';
      return;
    }

    // 파일 크기 검증
    if (file.size > MAX_SIZE) {
      fileError.value = '이미지 크기는 5MB 이하여야 합니다.';
      return;
    }

    fileError.value = null;
    previewUrl.value = URL.createObjectURL(file);
  }

  // 폼 유효성 검사
  const errors = reactive({
    name: null as string | null,
    slug: null as string | null,
  });

  function validate(): boolean {
    errors.name = null;
    errors.slug = null;

    if (!form.name.trim()) {
      errors.name = '워크스페이스 이름을 입력해주세요.';
    }

    if (!form.slug.trim()) {
      errors.slug = 'Slug를 입력해주세요.';
    }

    return !errors.name && !errors.slug;
  }

  function onSubmit() {
    if (!validate()) return;
    // TODO: API 호출 (composable 연결 후)
    console.log('submit', form);
  }

  // 모달 닫힐 때 상태 초기화
  function onClose() {
    form.name = '';
    form.slug = '';
    form.description = null;
    form.logoUrl = '';
    errors.name = null;
    errors.slug = null;
    previewUrl.value = null;
    fileError.value = null;
    isSlugManuallyEdited.value = false;
  }
</script>

<template>
  <UModal v-model:open="isOpen" title="Create New Workspace">
    <template #body>
      <div class="flex flex-col gap-4">
        <!-- 로고 업로드 -->
        <div class="flex flex-col items-center gap-2">
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="hidden"
            @change="onFileChange"
          />
          <div
            class="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-600"
            @click="onLogoClick"
          >
            <img v-if="previewUrl" :src="previewUrl" class="h-full w-full object-cover" />
            <UIcon v-else name="i-lucide-upload" class="text-gray-400" />
          </div>
          <span class="text-xs text-gray-400">Click to upload workspace logo</span>
          <!-- 에러 메시지 -->
          <span v-if="fileError" class="text-xs text-red-400">{{ fileError }}</span>
        </div>

        <!-- Workspace Name -->
        <UFormField label="Workspace Name" required :error="errors.name ?? undefined">
          <UInput v-model="form.name" placeholder="Enter workspace name" class="w-full" />
        </UFormField>

        <!-- Slug -->
        <UFormField label="Slug" required :error="errors.slug ?? undefined">
          <UInput
            v-model="form.slug"
            placeholder="workspace-slug"
            class="w-full"
            @input="isSlugManuallyEdited = true"
          />
          <template #hint>
            <span class="text-xs text-gray-400"
              >URL: cosider.com/workspace/{{ form.slug || 'your-slug' }}
            </span>
          </template>
        </UFormField>

        <!-- Description -->
        <UFormField label="Description" hint="optional">
          <UTextarea
            :model-value="form.description ?? ''"
            placeholder="Describe your workspace..."
            class="w-full"
            @update:model-value="form.description = $event || null"
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="outline" @click="isOpen = false">Cancel</UButton>
        <UButton @click="onSubmit">Create Workspace</UButton>
      </div>
    </template>
  </UModal>
</template>
