export enum EPriority {
  LOW = 'LOW', // 낮음
  MID = 'MID', // 중간
  HIGH = 'HIGH', // 높음
}

export enum EFileVisibility {
  PRIVATE = 'PRIVATE', // 비공개
  PROJECT = 'PROJECT', // 프로젝트 전체
  WORKSPACE = 'WORKSPACE', // 워크스페이스 전체
  PUBLIC = 'PUBLIC', // 전체 공개
}

export enum EFileRefType {
  USER = 'USER', // 사용자 프로필 이미지
  PROJECT = 'PROJECT', // 프로젝트 로고 이미지
  TASK = 'TASK', // 태스크 첨부파일
  WORKSPACE = 'WORKSPACE', // 워크스페이스 로고 이미지
  DOCUMENT = 'DOCUMENT', // 문서 첨부파일
}
