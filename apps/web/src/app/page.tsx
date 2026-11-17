const modules = [
  { title: 'Cálculos tributários', description: 'Centralize simulações e resultados dos motores fiscais integrados.', status: 'Em preparação' },
  { title: 'Documentos fiscais', description: 'Organize documentos, processamento e histórico de operações.', status: 'Em preparação' },
  { title: 'Empresas e acessos', description: 'Estrutura multiempresa com permissões por organização.', status: 'Fundação' },
  { title: 'Auditoria', description: 'Rastreabilidade de ações, versões e eventos relevantes.', status: 'Fundação' },
];

export default function HomePage() {
  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Tax Intelligence Brasil">
          <span className="brand-mark">TI</span>
          <span>TAX INTELLIGENCE <b>BRASIL</b></span>
        </a>
        <span className="environment">AMBIENTE DE DESENVOLVIMENTO</span>
      </header>

      <section className="hero">
        <p className="eyebrow">PLATAFORMA DE INTELIGÊNCIA FISCAL</p>
        <h1>Visão clara da sua<br /><span>operação tributária.</span></h1>
        <p className="intro">Uma base integrada para cálculos, documentos fiscais, empresas e auditoria. Os motores fiscais permanecem rastreáveis e independentes.</p>
        <div className="hero-meta"><span className="pulse" /> Fundação do produto em andamento</div>
      </section>

      <section className="section-heading">
        <div><p className="eyebrow">CENTRAL DE OPERAÇÕES</p><h2>Módulos da plataforma</h2></div>
        <span className="counter">04 MÓDULOS</span>
      </section>

      <section className="module-grid" aria-label="Módulos da plataforma">
        {modules.map((module, index) => (
          <article className="module-card" key={module.title}>
            <span className="module-index">0{index + 1}</span>
            <div><h3>{module.title}</h3><p>{module.description}</p></div>
            <span className="module-status">{module.status}</span>
          </article>
        ))}
      </section>

      <footer>
        <span>© {new Date().getFullYear()} Tax Intelligence Brasil</span>
        <span>Produto independente. Sem vínculo ou endosso da Receita Federal.</span>
      </footer>
    </main>
  );
}
