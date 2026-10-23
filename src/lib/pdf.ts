import { jsPDF } from "jspdf";
import { PDF_LOGO, PDF_LOGO_RATIO } from "./pdfLogo";
import { PDF_REGULAR, PDF_BOLD } from "./pdfFonts";
import { BRAND, money } from "./brand";
import { BRIEFING_LABELS, DEFAULT_PAYMENT_TERMS, DOCUMENT_CONDITIONS, documentReference, type CommercialDocument } from "./documentContent";

const BLUE = '#1657f5', NAVY = '#0d2345', MUTED = '#61718a';
const LEFT = 44, WIDTH = 507, BOTTOM = 760;
const clean = (text: string) => text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/[\u2010-\u2015]/g, '-').replace(/\u00a0/g, ' ');
function filename(name: string) { return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'cliente'; }

function documentLayout(title: string, client: string, reference?: string) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  doc.addFileToVFS('PedroSans-Regular.ttf', PDF_REGULAR);
  doc.addFileToVFS('PedroSans-Bold.ttf', PDF_BOLD);
  doc.addFont('PedroSans-Regular.ttf', 'PedroSans', 'normal');
  doc.addFont('PedroSans-Bold.ttf', 'PedroSans', 'bold');
  doc.setProperties({ title: `${title} | ${client}`, author: BRAND.name, creator: 'PedroDEV' });
  let y = 0;
  const text = (value: string, x: number, top: number, size = 10, color = NAVY, font = 'normal') => {
    doc.setFont('PedroSans', font); doc.setFontSize(size); doc.setTextColor(color); doc.text(clean(value), x, top);
  };
  const header = (first: boolean) => {
    doc.setFillColor(NAVY); doc.rect(0, 0, 596, first ? 160 : 88, 'F');
    doc.addImage(PDF_LOGO, 'PNG', LEFT, 28, 40, 40 / PDF_LOGO_RATIO, 'pg-wordmark', 'FAST');
    text('Pedro Gomes', 98, 40, 12, '#ffffff', 'bold');
    text('DESENVOLVIMENTO DIGITAL', 98, 54, 7, '#b6c9e8');
    doc.setFont('PedroSans', 'normal'); doc.setFontSize(8);
    text(documentReference(reference), 551 - doc.getTextWidth(documentReference(reference)), 42, 8, '#b6c9e8');
    if (first) {
      text(title, LEFT, 105, 29, '#ffffff', 'bold');
      text('Estratégia, design e tecnologia para o seu projeto.', LEFT, 130, 10, '#b6c9e8');
    }
    doc.setFillColor(BLUE); doc.rect(0, first ? 160 : 88, 596, 4, 'F');
    y = first ? 194 : 120;
  };
  header(true);
  const ensure = (space: number) => {
    if (y + space > BOTTOM) { doc.addPage(); header(false); }
  };
  const paragraph = (value: string, size = 11, color = NAVY, bold = false, indent = 0) => {
    doc.setFont('PedroSans', bold ? 'bold' : 'normal'); doc.setFontSize(size);
    const lines: string[] = doc.splitTextToSize(clean(value), WIDTH - indent);
    for (const line of lines) { ensure(size * 1.5); text(line, LEFT + indent, y, size, color, bold ? 'bold' : 'normal'); y += size * 1.5; }
    y += 7;
  };
  const section = (label: string, value: string) => {
    ensure(70); y += 10; paragraph(label.toUpperCase(), 8, BLUE, true); paragraph(value);
  };
  const finish = (prefix: string, download: boolean) => {
    const count = doc.getNumberOfPages();
    for (let page = 1; page <= count; page++) {
      doc.setPage(page); doc.setDrawColor('#dee5ef'); doc.line(LEFT, 787, 551, 787);
      text('Pedro Gomes · pedrogm.com.br', LEFT, 805, 8, MUTED);
      text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} · ${page}/${count}`, 365, 805, 8, MUTED);
      doc.link(LEFT, 794, 200, 16, { url: 'https://pedrogm.com.br' });
    }
    if (download) doc.save(`${prefix}-${filename(client)}.pdf`);
    return doc;
  };
  return { doc, text, paragraph, section, ensure, finish, get y() { return y; }, set y(value: number) { y = value; } };
}

function commercialPdf(params: CommercialDocument, contract: boolean, download: boolean) {
  const layout = documentLayout(contract ? (params.draft ? 'Minuta de contrato' : 'Contrato de serviços') : 'Proposta comercial', params.clientName, params.reference);
  const { doc, text, paragraph, section, ensure } = layout;
  paragraph(contract ? 'CONTRATANTE' : 'PREPARADA EXCLUSIVAMENTE PARA', 8, BLUE, true);
  paragraph(params.clientName, 22, NAVY, true);
  if (params.company) paragraph(params.company, 11, MUTED);
  if (contract && params.document) paragraph(`CPF/CNPJ: ${params.document}`, 10, MUTED);
  if (contract && params.address) paragraph(`Endereço: ${params.address}`, 10, MUTED);
  if (contract) paragraph(`Contratado: ${BRAND.name} | Desenvolvimento digital`, 10, MUTED);
  section(contract ? '01 / Objeto e entregas' : '01 / Seu projeto', params.service);
  for (const [index, item] of (params.items || []).entries()) {
    paragraph(`${String(index + 1).padStart(2, '0')}   ${item}`, 10, NAVY, false, 12);
  }
  ensure(100); layout.y += 10;
  const boxY = layout.y;
  doc.setFillColor('#edf3ff'); doc.roundedRect(LEFT, boxY, WIDTH, 78, 10, 10, 'F');
  text('INVESTIMENTO', LEFT + 18, boxY + 23, 8, BLUE, 'bold');
  text(money(params.value), LEFT + 18, boxY + 53, 24, NAVY, 'bold');
  text('PRAZO ESTIMADO', 365, boxY + 23, 8, BLUE, 'bold');
  text(`${params.deadlineDays} dias`, 365, boxY + 53, 22, NAVY, 'bold');
  layout.y += 98;
  section('02 / Pagamento', params.paymentTerms || DEFAULT_PAYMENT_TERMS);
  if (params.notes) section('03 / Combinados do projeto', params.notes);
  for (const [label, content] of DOCUMENT_CONDITIONS) section(label, content);
  if (params.status) {
    const status = { pendente: 'Aguardando resposta', aprovado: 'Proposta aprovada', recusado: 'Ajustes solicitados', aceito: 'Contrato aceito' }[params.status] || params.status;
    section('Situação na emissão deste PDF', status);
  }
  if (params.publicUrl && /^https?:\/\//.test(params.publicUrl)) {
    ensure(86); layout.y += 12;
    doc.setFillColor(BLUE); doc.roundedRect(LEFT, layout.y, WIDTH, 43, 8, 8, 'F');
    text(contract ? 'Abrir contrato e registrar aceite' : 'Ver proposta e responder', LEFT + 16, layout.y + 27, 11, '#ffffff', 'bold');
    doc.link(LEFT, layout.y, WIDTH, 43, { url: params.publicUrl }); layout.y += 64;
    paragraph('O botão acima abre a versão online deste documento.', 9, MUTED);
  }
  return layout.finish(contract ? 'contrato' : 'proposta', download);
}
export function generateProposalPdf(params: CommercialDocument, download = true) { return commercialPdf(params, false, download); }
export function generateContractPdf(params: CommercialDocument, download = true) { return commercialPdf(params, true, download); }
export function generateBriefingPdf(params: { clientName: string; company?: string; answers: Record<string, string>; reference?: string }, download = true) {
  const layout = documentLayout('Briefing do projeto', params.clientName, params.reference);
  layout.paragraph('DIREÇÃO DO PROJETO', 8, BLUE, true);
  layout.paragraph(params.clientName, 22, NAVY, true);
  if (params.company) layout.paragraph(params.company, 11, MUTED);
  for (const key of Object.keys(BRIEFING_LABELS)) layout.section(BRIEFING_LABELS[key], params.answers[key] || 'Não informado');
  return layout.finish('briefing', download);
}
