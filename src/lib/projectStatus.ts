export const PROJECT_STATUSES = [
  "Rascunho",
  "Aguardando cliente",
  "Em desenvolvimento",
  "Em revisão",
  "Concluído",
  "Atrasado",
];
export function statusStep(status: string) {
  return (
    (
      {
        Rascunho: 0,
        "Aguardando cliente": 1,
        "Em desenvolvimento": 2,
        "Em revisão": 3,
        Concluído: 4,
        Atrasado: 2,
      } as Record<string, number>
    )[status] ?? 0
  );
}
export const PROJECT_STEPS = [
  "Preparação",
  "Briefing e materiais",
  "Desenvolvimento",
  "Revisão",
  "Entrega",
];
