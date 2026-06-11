<script setup lang="ts">
  import type { ICreateWorkspaceRequest } from '@cosider/shared';
  import type { FormError, FormSubmitEvent } from '@nuxt/ui';

  const isOpen = defineModel<boolean>({ default: false });

  const form = reactive<ICreateWorkspaceRequest>({
    name: '',
    slug: '',
    description: null,
    logoUrl: null,
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

  // slug 입력 시 자동 변환 방지 및 유효한 slug 형식 유지
  function onSlugInput(value: string) {
    isSlugManuallyEdited.value = value !== ''; // slug에 값이 있을 때만 true
    form.slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  // image upload
  // TODO: presigned URL → S3 업로드 연결 필요 (백엔드 완성 후)
  const logoFile = ref<File | null>(null);
  const previewUrl = ref<string | null>(null);
  const fileError = ref<string | null>(null);

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  // 로고 파일 변경 시 미리보기 및 검증
  watch(logoFile, (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      fileError.value = '지원하지 않는 파일 형식입니다. (jpg, png, webp)';
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
        previewUrl.value = null;
      }
      return;
    }

    if (file.size > MAX_SIZE) {
      fileError.value = '이미지 크기는 5MB 이하여야 합니다.';
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
        previewUrl.value = null;
      }
      return;
    }

    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    fileError.value = null;
    previewUrl.value = URL.createObjectURL(file);
  });

  // 폼 유효성 검사
  function validate(state: typeof form): FormError[] {
    const errors: FormError[] = [];
    if (!state.name.trim())
      errors.push({ name: 'name', message: '워크스페이스 이름을 입력해주세요.' });
    if (!state.slug.trim()) errors.push({ name: 'slug', message: 'Slug를 입력해주세요.' });
    return errors;
  }

  async function onSubmit(event: FormSubmitEvent<typeof form>) {
    // TODO: API 호출
    console.log('submit', event.data);
  }

  // 모달 닫힐 때 상태 초기화
  function onClose() {
    form.name = '';
    form.slug = '';
    form.description = null;
    form.logoUrl = null;
    fileError.value = null;
    isSlugManuallyEdited.value = false;

    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
      previewUrl.value = null;
    }

    logoFile.value = null;
  }
</script>

<template>
  <UModal v-model:open="isOpen" title="Create New Workspace">
    <template #body>
      <UForm
        id="workspace-form"
        :validate="validate"
        :state="form"
        :validate-on="[]"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <!-- 로고 업로드 -->
        <UFormField label="Workspace Logo">
          <UFileUpload
            v-slot="{ open }"
            v-model="logoFile"
            accept="image/jpeg,image/png,image/webp"
            :preview="false"
          >
            <div class="flex flex-col items-center gap-2">
              <div
                class="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-600"
                @click="open()"
              >
                <img v-if="previewUrl" :src="previewUrl" class="h-full w-full object-cover" />
                <UIcon v-else name="i-lucide-upload" class="text-gray-400" />
              </div>
              <span class="text-xs text-gray-400">Click to upload workspace logo</span>
              <span v-if="fileError" class="text-xs text-red-400">{{ fileError }}</span>
            </div>
          </UFileUpload>
        </UFormField>

        <!-- Workspace Name -->
        <UFormField label="Workspace Name" name="name" required>
          <UInput v-model="form.name" placeholder="Enter workspace name" class="w-full" />
        </UFormField>

        <!-- Slug -->
        <UFormField label="Slug" name="slug" required>
          <UInput
            :model-value="form.slug"
            placeholder="workspace-slug"
            class="w-full"
            @update:model-value="onSlugInput"
          />
          <template #hint>
            <span class="text-xs text-gray-400"
              >URL: cosider.com/workspace/{{ form.slug || 'your-slug' }}
            </span>
          </template>
        </UFormField>

        <!-- Description -->
        <UFormField label="Description" name="description" hint="optional">
          <UTextarea
            :model-value="form.description ?? ''"
            placeholder="Describe your workspace..."
            class="w-full"
            @update:model-value="form.description = $event || null"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="outline" @click="isOpen = false">Cancel</UButton>
        <UButton type="submit" form="workspace-form">Create Workspace</UButton>
      </div>
    </template>
  </UModal>
</template>
