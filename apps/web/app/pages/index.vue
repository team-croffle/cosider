<template>
  <div>
    <UPageHero
      title="기획부터 유지보수까지, 한 프로젝트에서"
      description="Cosider는 요구사항, 태스크, API, 테스트를 서로 잇는 소프트웨어 전주기 협업 툴입니다. 기획 → 설계 → 구현 → 테스트 → 배포를 한 워크스페이스에서 추적하세요."
      :links="[
        {
          label: 'Get started',
          to: '/auth/signup',
          trailingIcon: 'i-lucide-arrow-right',
          size: 'xl',
        },
        {
          label: 'GitHub',
          to: 'https://github.com/team-croffle/cosider',
          target: '_blank',
          icon: 'i-simple-icons-github',
          size: 'xl',
          color: 'neutral',
          variant: 'subtle',
        },
      ]"
    />

    <UPageSection
      id="features"
      title="흩어진 산출물을 한 줄로"
      description="문서와 보드와 스펙이 다른 도구에 있을 필요 없습니다. Cosider는 같은 프로젝트 안에서 서로를 가리키게 합니다."
      :features="[
        {
          icon: 'i-lucide-waypoints',
          title: '추적성',
          description:
            '요구사항, 태스크, API 스펙, 테스트가 링크로 연결됩니다. 이 작업이 어디서 왔고 무엇으로 검증되는지 한 화면에서 봅니다.',
        },
        {
          icon: 'i-lucide-milestone',
          title: 'SDLC 스테이지 게이트',
          description:
            'Waterfall부터 Scrum, Kanban까지 프로젝트 유형에 맞는 단계와 필수 산출물을 둡니다. 게이트를 통과해야 다음으로 갑니다.',
        },
        {
          icon: 'i-lucide-pen-line',
          title: '문서와 화이트보드',
          description:
            '요구사항 문서와 화이트보드를 같은 프로젝트에서 작성합니다. 객체는 요구사항·태스크에 바로 매핑됩니다.',
        },
        {
          icon: 'i-lucide-users',
          title: '워크스페이스와 역할',
          description:
            '팀 공간을 slug로 나누고 Owner부터 Viewer까지 역할을 부여합니다. 프로젝트는 그 안에서 키로 식별됩니다.',
        },
      ]"
    />

    <UPageSection>
      <UPageCTA
        title="프로젝트의 전 과정을 한곳에"
        description="워크스페이스를 만들고, 요구사항부터 배포까지 추적하세요."
        variant="subtle"
        :links="[
          {
            label: 'Get started',
            to: '/auth/signup',
            trailingIcon: 'i-lucide-arrow-right',
            color: 'neutral',
          },
          {
            label: 'GitHub',
            to: 'https://github.com/team-croffle/cosider',
            target: '_blank',
            icon: 'i-simple-icons-github',
            color: 'neutral',
            variant: 'outline',
          },
        ]"
      />
    </UPageSection>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'landing',
  });
</script>
