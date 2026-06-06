export interface ISdlcTemplate {
  id: string;
  sdlcType: string;
  // TODO: 향후 수정
  phases: Record<string, string>;
}
