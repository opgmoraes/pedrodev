import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebaseClient'

export type ProjectStatus = 'azul' | 'ambar' | 'verde'

export type PortfolioProject = {
  title: string
  description: string
  statusText: string
  statusColor: ProjectStatus
  link1Text: string
  link1Url: string
  link2Text: string
  link2Url: string
  footnote: string
}

export type PortfolioContent = {
  heroDescription: string
  sobreP1: string
  sobreP2: string
  projetos: [PortfolioProject, PortfolioProject, PortfolioProject]
}

const DOC_REF = doc(db, 'siteContent', 'portfolio')

export async function getPortfolioContent(): Promise<Partial<PortfolioContent> | null> {
  const snap = await getDoc(DOC_REF)
  return snap.exists() ? (snap.data() as Partial<PortfolioContent>) : null
}

export async function savePortfolioContent(content: PortfolioContent) {
  await setDoc(DOC_REF, content, { merge: true })
}

export const STATUS_CLASS: Record<ProjectStatus, string> = {
  azul: 'px-3 py-1 border border-blue-500/30 bg-blue-500/10 rounded-full text-[10px] text-blue-400 tracking-widest uppercase font-medium',
  ambar: 'px-3 py-1 border border-amber-500/30 bg-amber-500/10 rounded-full text-[10px] text-amber-400 tracking-widest uppercase font-medium',
  verde: 'px-3 py-1 border border-emerald-500/30 bg-emerald-500/10 rounded-full text-[10px] text-emerald-400 tracking-widest uppercase font-medium',
}
