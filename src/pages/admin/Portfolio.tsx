import { ErrorMessage, loadError, saveError } from "../../components/Feedback";
import { useEffect, useState } from "react";
import {
  getPortfolioContent,
  savePortfolioContent,
  type PortfolioContent,
  type PortfolioProject,
} from "../../lib/portfolioContent";

import { PROJECT_DEFAULTS, mergeProjectContent } from "../../lib/projectCatalog";

const DEFAULTS: PortfolioContent = {
  heroDescription:
    "Graduado em Análise e Desenvolvimento de Sistemas (ADS). Desenvolvedor Web e Founder — construo do zero e cuido pra continuar funcionando depois.",
  sobreP1:
    "Construo produtos do zero: penso no design, escrevo o código e ligo tudo às APIs que fazem funcionar de verdade. Quando o usuário nem repara na tecnologia por trás, é sinal de que deu certo.",
  sobreP2:
    "Isso junta engenharia com atenção a detalhe: interface rápida, fluida e que não atravanca quem tá usando.",
  projetos: PROJECT_DEFAULTS,
};

export default function Portfolio() {
  const [error, setError] = useState("");
  const [content, setContent] = useState<PortfolioContent>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getPortfolioContent()
      .then((saved) => {
        if (saved)
          setContent({
            ...DEFAULTS,
            ...saved,
            projetos: mergeProjectContent(saved.projetos),
          });
        setLoading(false);
      })
      .catch(() => {
        setError(loadError);
        setLoading(false);
      });
  }, []);

  function updateProject(i: number, patch: Partial<PortfolioProject>) {
    setContent((c) => {
      const projetos = [...c.projetos] as PortfolioContent["projetos"];
      projetos[i] = { ...projetos[i], ...patch };
      return { ...c, projetos };
    });
  }

  async function handleSave() {
    try {
      setSaving(true);
      setSaved(false);
      await savePortfolioContent(content);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError(saveError);
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="mono" style={{ color: "var(--text-muted)" }}>
        carregando…
      </div>
    );

  return (
    <div>
      <ErrorMessage message={error} />
      <div className="crumb">admin / portfólio</div>
      <h1>Portfólio</h1>
      <p className="page-subtitle">
        edita o que aparece em{" "}
        <a
          href="/portifolio"
          target="_blank"
          rel="noreferrer"
          className="link-underline"
        >
          /portifolio
        </a>{" "}
        — textos e links dos 7 projetos; as galerias são definidas no catálogo do site
      </p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Apresentação &amp; Sobre</h2>
        <label htmlFor="field-1">
          Resumo da página de portfólio (a home usa uma apresentação curta fixa)
        </label>
        <textarea
          id="field-1"
          rows={3}
          value={content.heroDescription}
          onChange={(e) =>
            setContent({ ...content, heroDescription: e.target.value })
          }
        />
        <label htmlFor="field-2">Sobre — parágrafo 1</label>
        <textarea
          id="field-2"
          rows={3}
          value={content.sobreP1}
          onChange={(e) => setContent({ ...content, sobreP1: e.target.value })}
        />
        <label htmlFor="field-3">Sobre — parágrafo 2</label>
        <textarea
          id="field-3"
          rows={3}
          value={content.sobreP2}
          onChange={(e) => setContent({ ...content, sobreP2: e.target.value })}
        />
      </div>

      {content.projetos.map((p, i) => (
        <div className="card" key={p.id || i}>
          <h2 style={{ marginTop: 0 }}>{p.title} · Projeto {i + 1}</h2>
          <label htmlFor={`project-${i}-field-4`}>Título</label>
          <input
            id={`project-${i}-field-4`}
            value={p.title}
            onChange={(e) => updateProject(i, { title: e.target.value })}
          />
          <label htmlFor={`project-${i}-field-5`}>Descrição</label>
          <textarea
            id={`project-${i}-field-5`}
            rows={3}
            value={p.description}
            onChange={(e) => updateProject(i, { description: e.target.value })}
          />
          <div className="grid grid-2">
            <div>
              <label htmlFor={`project-${i}-field-6`}>Status</label>
              <input
                id={`project-${i}-field-6`}
                value={p.statusText}
                onChange={(e) =>
                  updateProject(i, { statusText: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor={`project-${i}-field-7`}>Cor do status</label>
              <select
                id={`project-${i}-field-7`}
                value={p.statusColor}
                onChange={(e) =>
                  updateProject(i, {
                    statusColor: e.target
                      .value as PortfolioProject["statusColor"],
                  })
                }
              >
                <option value="azul">azul — em produção</option>
                <option value="ambar">âmbar — em desenvolvimento</option>
                <option value="verde">verde — concluído</option>
              </select>
            </div>
          </div>
          <div className="grid grid-2">
            <div>
              <label htmlFor={`project-${i}-field-8`}>
                Link principal — texto
              </label>
              <input
                id={`project-${i}-field-8`}
                value={p.link1Text}
                onChange={(e) =>
                  updateProject(i, { link1Text: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor={`project-${i}-field-9`}>
                Link principal — URL
              </label>
              <input
                id={`project-${i}-field-9`}
                value={p.link1Url}
                onChange={(e) => updateProject(i, { link1Url: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-2">
            <div>
              <label htmlFor={`project-${i}-field-10`}>
                Link secundário — texto (opcional)
              </label>
              <input
                id={`project-${i}-field-10`}
                value={p.link2Text}
                onChange={(e) =>
                  updateProject(i, { link2Text: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor={`project-${i}-field-11`}>
                Link secundário — URL
              </label>
              <input
                id={`project-${i}-field-11`}
                value={p.link2Url}
                onChange={(e) => updateProject(i, { link2Url: e.target.value })}
              />
            </div>
          </div>
          <label htmlFor={`project-${i}-field-12`}>Nota de rodapé</label>
          <input
            id={`project-${i}-field-12`}
            value={p.footnote}
            onChange={(e) => updateProject(i, { footnote: e.target.value })}
          />
        </div>
      ))}

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={handleSave} disabled={saving || error === loadError}>
          {saving ? "salvando…" : "salvar alterações"}
        </button>
        {saved && (
          <span style={{ color: "var(--success)", fontSize: 13 }}>
            salvo — já está no ar
          </span>
        )}
      </div>
    </div>
  );
}
