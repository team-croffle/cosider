import { EWorkspaceUserRole } from '@cosider/shared';

const ROLE_WEIGHT: Record<EWorkspaceUserRole, number> = {
  // 권한별 가중치 (낮을수록 권한이 낮음)
  // 문서에 명시된 규칙은 아니고 서비스 내부에서만 사용되는 규칙임.
  [EWorkspaceUserRole.VIEWER]: 10,
  [EWorkspaceUserRole.MEMBER]: 20,
  [EWorkspaceUserRole.ADMIN]: 30,
  [EWorkspaceUserRole.OWNER]: 40,
};

export function canManage(actorRole: EWorkspaceUserRole, targetRole: EWorkspaceUserRole): boolean {
  return ROLE_WEIGHT[actorRole] > ROLE_WEIGHT[targetRole];
}

export function isOwner(role: EWorkspaceUserRole): boolean {
  return role === EWorkspaceUserRole.OWNER;
}
