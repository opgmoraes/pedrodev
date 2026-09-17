import { jsPDF } from 'jspdf'

// Geração simples de PDF client-side com jsPDF.
// Visual minimalista em mono, alinhado ao design system do sistema.

const BRAND = 'Pedro Gomes | Tech'

function baseDoc() {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  doc.setFont('courier', 'normal')
  return doc
}

function header(doc: jsPDF, title: string) {
  doc.setFontSize(10)
  doc.setTextColor(120)
  doc.text(BRAND, 40, 40)
  doc.setFontSize(20)
  doc.setTextColor(20)
  doc.text(title, 40, 70)
  doc.setDrawColor(220)
  doc.line(40, 85, 555, 85)
}

function footer(doc: jsPDF) {
  const date = new Date().toLocaleDateString('pt-BR')
  doc.setFontSize(9)
  doc.setTextColor(150)
  doc.text(`Documento gerado em ${date} — ${BRAND}`, 40, 800)
}

export function generateProposalPdf(params: {
  clientName: string
  company?: string
  service: string
  value: number
  deadlineDays: number
}) {
  const doc = baseDoc()
  header(doc, 'Proposta Comercial')

  let y = 120
  doc.setFontSize(12)
  doc.setTextColor(30)

  const lines = [
    `Cliente: ${params.clientName}${params.company ? ` (${params.company})` : ''}`,
    '',
    'Escopo do serviço:',
    params.service,
    '',
    `Valor: R$ ${params.value.toFixed(2)}`,
    `Prazo estimado: ${params.deadlineDays} dias corridos a partir da confirmação`,
    '',
    'Condições:',
    '- Pagamento conforme acordo comercial (à vista ou parcelado).',
    '- Início do projeto após confirmação do pagamento e envio do briefing.',
    '- Prazo contado a partir da data de recebimento das informações completas.',
  ]

  for (const line of lines) {
    const wrapped = doc.splitTextToSize(line, 500)
    doc.text(wrapped, 40, y)
    y += wrapped.length * 16 + 6
  }

  footer(doc)
  doc.save(`proposta-${params.clientName.toLowerCase().replace(/\s+/g, '-')}.pdf`)
}

export function generateContractPdf(params: {
  clientName: string
  document?: string
  address?: string
  service: string
  value: number
  deadlineDays: number
}) {
  const doc = baseDoc()
  header(doc, 'Contrato de Prestação de Serviços')

  let y = 120
  doc.setFontSize(11)
  doc.setTextColor(30)

  const lines = [
    'CONTRATANTE:',
    `${params.clientName}${params.document ? ` — CPF/CNPJ: ${params.document}` : ''}`,
    params.address ? `Endereço: ${params.address}` : '',
    '',
    'CONTRATADO:',
    'Pedro Gomes | Tech',
    '',
    'OBJETO DO CONTRATO:',
    params.service,
    '',
    'VALOR E CONDIÇÕES DE PAGAMENTO:',
    `R$ ${params.value.toFixed(2)}, conforme condições acordadas entre as partes.`,
    '',
    'PRAZO:',
    `${params.deadlineDays} dias corridos, a contar da data de início do projeto.`,
    '',
    'DISPOSIÇÕES GERAIS:',
    '- O cliente é responsável pela titularidade do domínio e, quando aplicável,',
    '  das contas de infraestrutura utilizadas no projeto.',
    '- O contratado receberá acesso de administrador/desenvolvedor.',
    '- Revisões e ajustes seguem o escopo definido nesta proposta; alterações',
    '  fora do escopo poderão gerar custo adicional, mediante acordo prévio.',
    '',
    '',
    '_________________________________          _________________________________',
    'Contratante                                    Contratado',
  ]

  for (const line of lines) {
    if (!line) { y += 10; continue }
    const wrapped = doc.splitTextToSize(line, 500)
    doc.text(wrapped, 40, y)
    y += wrapped.length * 15 + 4
  }

  footer(doc)
  doc.save(`contrato-${params.clientName.toLowerCase().replace(/\s+/g, '-')}.pdf`)
}
