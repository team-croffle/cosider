import { EFileVisibility } from './common.enum';

/** DB 테이블(media_files) 계약. timestamptz 컬럼은 Date. */
export interface IMediaFile {
  id: string;
  bucketName: string;
  objectKey: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  // WHY: 파일 컨텍스트를 통해, 해당 파일의 접근 권한을 검증하기 위함
  // 이 파일을 직접적으로 reference하는 대상의 id
  contextId: string;
  // 파일을 reference하는 대상이 속한 워크스페이스 id
  // WHY: 파일을 reference하는 대상이 속한 워크스페이스 id를 통해, 해당 파일의 접근 권한을 검증하기 위함
  // 이게 없으면, Visibility가 있어도 context의 스키마를 전부 뒤져서 어디에 속하는지 판단해야 함
  workspaceId: string | null;
  // 파일을 reference하는 대상이 속한 프로젝트 id
  // WHY: 파일을 reference하는 대상이 속한 프로젝트 id를 통해, 해당 파일의 접근 권한을 검증하기 위함
  // 위와 같음
  projectId: string | null;
  visibility: EFileVisibility;
  ownerId: string | null;
  createdAt: Date;
}
