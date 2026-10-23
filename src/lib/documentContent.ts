export type CommercialDocument = {
  clientName: string;
  company?: string;
  document?: string;
  address?: string;
  service: string;
  items?: string[];
  value: number;
  deadlineDays: number;
  paymentTerms?: string;
  notes?: string;
  reference?: string;
  publicUrl?: string;
  status?: string;
  draft?: boolean;
};
export const DEFAULT_PAYMENT_TERMS = 'Pagamento conforme as condições acordadas entre as partes.';
export const DOCUMENT_CONDITIONS = [
  ['Início e prazo', 'O prazo começa após a confirmação do pagamento combinado e o recebimento do briefing e dos materiais completos.'],
  ['Escopo e alterações', 'As entregas seguem o escopo descrito neste documento. Solicitações adicionais dependem de aprovação de novo valor e prazo antes da execução.'],
  ['Contas e acessos', 'O cliente mantém a titularidade do domínio e das contas de infraestrutura. Pedro Gomes recebe os acessos necessários ao desenvolvimento.'],
] as const;
export const BRIEFING_LABELS: Record<string, string> = {
  negocio: 'Sobre o negócio', publico: 'Público-alvo', objetivo: 'Objetivo do projeto',
  cores: 'Direção visual', referencias: 'Referências',
};
export function documentReference(value?: string) {
  return value ? `PG-${value.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}` : 'PERSONALIZADO';
}
