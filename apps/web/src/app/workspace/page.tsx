'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, apiRequest } from '@/lib/api';

type CurrentUser = { userId: string; organizationId: string; role: string };
type Organization = { id: string; name: string; slug: string; role: string };
type Company = { id: string; legalName: string; taxIdentifierMasked: string; createdAt: string };
type Calculation = { id: string; engine: string; status: string; engineVersion: string; createdAt: string };
type CalculationDetail = Calculation & { engineCommitSha: string; engineRepository: string; originalOutput: unknown; inputPayload: unknown; responseMetadata: unknown; errorCode: string | null; correlationId: string };
type DocumentRecord = { id: string; type: string; status: string; createdAt: string };
type MemberRecord = { role: string; createdAt: string; user: { id: string; email: string; displayName: string } };
type AuditRecord = { id: string; action: string; resourceType: string; createdAt: string; actorUserId: string | null };

export default function WorkspacePage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [selectedCalculation, setSelectedCalculation] = useState<CalculationDetail | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditRecord[]>([]);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('ACCOUNTANT');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [legalName, setLegalName] = useState('');
  const [taxIdentifier, setTaxIdentifier] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [xml, setXml] = useState('');
  const [engine, setEngine] = useState('RTC_REGIME_REGULAR');
  const [calculationJson, setCalculationJson] = useState('{\n  \n}');

  async function loadWorkspace() {
    const currentUser = await apiRequest<CurrentUser>('/auth/me');
    const [currentOrganization, companyRows, calculationRows, documentRows, memberRows, auditRows] = await Promise.all([
      apiRequest<Organization>('/organizations/current'),
      apiRequest<Company[]>('/companies'),
      apiRequest<Calculation[]>('/calculations'),
      apiRequest<DocumentRecord[]>('/documents'),
      apiRequest<MemberRecord[]>('/organizations/current/members'),
      ['OWNER', 'ADMIN', 'ACCOUNTANT'].includes(currentUser.role)
        ? apiRequest<AuditRecord[]>('/audit?limit=20')
        : Promise.resolve([] as AuditRecord[]),
    ]);
    setUser(currentUser);
    setOrganization(currentOrganization);
    setCompanies(companyRows);
    setCalculations(calculationRows);
    setDocuments(documentRows);
    setMembers(memberRows);
    setAuditEvents(auditRows);
  }

  useEffect(() => {
    let active = true;
    async function initialize() {
      try {
        await loadWorkspace();
      } catch (error) {
        if (active && error instanceof ApiError && error.status === 401) router.replace('/login');
        else if (active) setMessage('Não foi possível carregar os dados da organização.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void initialize();
    return () => { active = false; };
  }, [router]);

  async function createCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const company = await apiRequest<Company>('/companies', {
        method: 'POST',
        body: JSON.stringify({
          legalName,
          taxIdentifier: taxIdentifier.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
        }),
      });
      setCompanies((current) => [company, ...current]);
      setLegalName('');
      setTaxIdentifier('');
      setMessage('Empresa cadastrada.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível cadastrar a empresa.');
    } finally {
      setBusy(false);
    }
  }

  async function createCalculation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const inputPayload: unknown = JSON.parse(calculationJson);
      if (typeof inputPayload !== 'object' || inputPayload === null || Array.isArray(inputPayload)) {
        throw new Error('O conteúdo do cálculo precisa ser um objeto JSON.');
      }
      const calculation = await apiRequest<Calculation>('/calculations', {
        method: 'POST',
        body: JSON.stringify({
          engine,
          inputPayload,
          ...(selectedCompanyId ? { companyId: selectedCompanyId } : {}),
        }),
      });
      setCalculations((current) => [calculation, ...current]);
      setMessage('Solicitação enviada ao motor fiscal.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível executar o cálculo.');
    } finally {
      setBusy(false);
    }
  }

  async function viewCalculation(id: string) {
    try {
      const detail = await apiRequest<CalculationDetail>('/calculations/' + id);
      setSelectedCalculation(detail);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível abrir o resultado.');
    }
  }

  async function createDanfse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const document = await apiRequest<DocumentRecord>('/documents/danfse', {
        method: 'POST',
        body: JSON.stringify({
          xml,
          stc: '0',
          canhoto: true,
          ...(selectedCompanyId ? { companyId: selectedCompanyId } : {}),
        }),
      });
      setDocuments((current) => [document, ...current]);
      setXml('');
      setMessage('DANFSe gerado e armazenado.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível gerar o DANFSe.');
    } finally {
      setBusy(false);
    }
  }

  async function downloadDocument(id: string) {
    try {
      const result = await apiRequest<{ url: string; expiresInSeconds: number }>('/documents/' + id + '/download');
      window.location.assign(result.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível obter o documento.');
    }
  }

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const member = await apiRequest<MemberRecord>('/organizations/current/members', {
        method: 'POST',
        body: JSON.stringify({ email: memberEmail, role: memberRole }),
      });
      setMembers((current) => [...current, member]);
      setMemberEmail('');
      setMessage('Membro adicionado à organização.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível adicionar o membro.');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    try { await apiRequest<void>('/auth/logout', { method: 'POST' }); }
    finally { router.replace('/login'); }
  }

  if (loading) return <main className="shell loading-state">Carregando ambiente...</main>;

  const canManageCompanies = ['OWNER', 'ADMIN', 'ACCOUNTANT'].includes(user?.role ?? '');
  const canOperateFiscal = ['OWNER', 'ADMIN', 'ACCOUNTANT', 'OPERATOR'].includes(user?.role ?? '');
  const canManageMembers = ['OWNER', 'ADMIN'].includes(user?.role ?? '');
  const canReadAudit = ['OWNER', 'ADMIN', 'ACCOUNTANT'].includes(user?.role ?? '');

  return (
    <main className="shell workspace">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Tax Intelligence Brasil">
          <span className="brand-mark">TI</span><span>TAX INTELLIGENCE <b>BRASIL</b></span>
        </a>
        <div className="account-area">
          <span className="environment">{organization?.name ?? 'Organização'}</span>
          <button className="quiet-button" onClick={logout}>Sair</button>
        </div>
      </header>

      <section className="workspace-heading">
        <div>
          <p className="eyebrow">CENTRAL DE OPERAÇÕES</p>
          <h1>{organization?.name ?? 'Sua organização'}</h1>
          <p className="intro">Ambiente fiscal integrado. Acesse empresas, motores de cálculo e documentos em um único espaço.</p>
        </div>
        <span className="role-chip">{user?.role ?? 'MEMBRO'}</span>
      </section>

      {message && <p className="notice" role="status">{message}</p>}

      <section className="metric-grid" aria-label="Resumo da organização">
        <article className="metric-card"><span>EMPRESAS</span><strong>{companies.length}</strong><small>Cadastros nesta organização</small></article>
        <article className="metric-card"><span>CÁLCULOS</span><strong>{calculations.length}</strong><small>Últimos 50 registros</small></article>
        <article className="metric-card"><span>DOCUMENTOS</span><strong>{documents.length}</strong><small>Últimos 50 registros</small></article>
      </section>

      <section className="workspace-grid">
        <article className="workspace-panel">
          <div className="panel-heading"><div><p className="eyebrow">CADASTRO</p><h2>Empresas</h2></div></div>
          {canManageCompanies && (
            <form className="stack-form" onSubmit={createCompany}>
              <label>Razão social<input value={legalName} onChange={(event) => setLegalName(event.target.value)} required minLength={2} maxLength={180} /></label>
              <label>CPF ou CNPJ<input value={taxIdentifier} onChange={(event) => setTaxIdentifier(event.target.value)} required inputMode="text" placeholder="CPF, CNPJ numérico ou alfanumérico" /></label>
              <button className="primary-button" disabled={busy}>Cadastrar empresa</button>
            </form>
          )}
          <div className="record-list">
            {companies.length === 0 ? <p className="empty-state">Nenhuma empresa cadastrada.</p> : companies.map((company) => (
              <div className="record-row" key={company.id}><div><strong>{company.legalName}</strong><small>{company.taxIdentifierMasked}</small></div><span className="record-dot" /></div>
            ))}
          </div>
        </article>

        <article className="workspace-panel">
          <div className="panel-heading"><div><p className="eyebrow">MOTOR FISCAL</p><h2>Novo cálculo</h2></div></div>
          {canOperateFiscal && (
            <form className="stack-form" onSubmit={createCalculation}>
              <label>Empresa (opcional)<select value={selectedCompanyId} onChange={(event) => setSelectedCompanyId(event.target.value)}>
                <option value="">Sem empresa vinculada</option>
                {companies.map((company) => <option key={company.id} value={company.id}>{company.legalName}</option>)}
              </select></label>
              <label>Motor<select value={engine} onChange={(event) => setEngine(event.target.value)}>
                <option value="RTC_REGIME_REGULAR">Regime Regular</option>
                <option value="RTC_SIMPLES_NACIONAL">Simples Nacional</option>
              </select></label>
              <label>Entrada JSON<textarea value={calculationJson} onChange={(event) => setCalculationJson(event.target.value)} rows={7} spellCheck={false} /></label>
              <button className="primary-button" disabled={busy}>Enviar para cálculo</button>
            </form>
          )}
          <div className="record-list">
            {calculations.slice(0, 5).map((item) => (
              <div className="record-row" key={item.id}><div><strong>{item.engine === 'RTC_REGIME_REGULAR' ? 'Regime Regular' : 'Simples Nacional'}</strong><small>Motor {item.engineVersion}</small></div><div className="record-actions"><span className="status-chip">{item.status}</span><button className="text-button compact" onClick={() => void viewCalculation(item.id)}>Ver resultado</button></div></div>
            ))}
            {calculations.length === 0 && <p className="empty-state">Nenhum cálculo registrado.</p>}
          </div>
          {selectedCalculation && (
            <div className="calculation-detail">
              <div className="panel-heading">
                <div><p className="eyebrow">RESPOSTA ORIGINAL DO MOTOR</p><h3>{selectedCalculation.engineVersion} · {selectedCalculation.status}</h3></div>
                <button className="quiet-button" onClick={() => setSelectedCalculation(null)}>Fechar</button>
              </div>
              <p className="detail-meta">Commit: {selectedCalculation.engineCommitSha}</p>
              {selectedCalculation.errorCode && <p className="form-error">Código: {selectedCalculation.errorCode}</p>}
              <pre>{JSON.stringify(selectedCalculation.originalOutput, null, 2) ?? 'Sem resposta armazenada.'}</pre>
              {selectedCalculation.responseMetadata && <details><summary>Metadados do motor</summary><pre>{JSON.stringify(selectedCalculation.responseMetadata, null, 2)}</pre></details>}
            </div>
          )}
        </article>

        <article className="workspace-panel document-panel">
          <div className="panel-heading"><div><p className="eyebrow">DOCUMENTOS FISCAIS</p><h2>Gerar DANFSe</h2></div></div>
          {canOperateFiscal && (
            <form className="stack-form" onSubmit={createDanfse}>
              <label>Empresa (opcional)<select value={selectedCompanyId} onChange={(event) => setSelectedCompanyId(event.target.value)}>
                <option value="">Sem empresa vinculada</option>
                {companies.map((company) => <option key={company.id} value={company.id}>{company.legalName}</option>)}
              </select></label>
              <label>XML da NFS-e<textarea value={xml} onChange={(event) => setXml(event.target.value)} rows={7} placeholder="Cole o XML completo da NFS-e nacional..." spellCheck={false} required minLength={20} /></label>
              <button className="primary-button" disabled={busy || xml.length < 20}>Gerar PDF</button>
            </form>
          )}
          <div className="record-list">
            {documents.slice(0, 5).map((item) => (
              <div className="record-row" key={item.id}><div><strong>DANFSe</strong><small>{new Date(item.createdAt).toLocaleString('pt-BR')}</small></div>
                {item.status === 'SUCCEEDED' ? <button className="text-button compact" onClick={() => void downloadDocument(item.id)}>Baixar PDF</button> : <span className="status-chip">{item.status}</span>}
              </div>
            ))}
            {documents.length === 0 && <p className="empty-state">Nenhum documento processado.</p>}
          </div>
        </article>
      </section>

      <section className="workspace-grid secondary-grid">
        <article className="workspace-panel">
          <div className="panel-heading"><div><p className="eyebrow">EQUIPE</p><h2>Membros da organização</h2></div></div>
          {canManageMembers && (
            <form className="stack-form" onSubmit={addMember}>
              <label>E-mail de uma conta cadastrada<input type="email" value={memberEmail} onChange={(event) => setMemberEmail(event.target.value)} required /></label>
              <label>Permissão<select value={memberRole} onChange={(event) => setMemberRole(event.target.value)}>
                <option value="ACCOUNTANT">Contador</option>
                <option value="OPERATOR">Operador</option>
                <option value="VIEWER">Consulta</option>
                {user?.role === 'OWNER' && <option value="ADMIN">Administrador</option>}
              </select></label>
              <button className="primary-button" disabled={busy}>Adicionar membro</button>
            </form>
          )}
          <div className="record-list">
            {members.map((member) => (
              <div className="record-row" key={member.user.id}>
                <div><strong>{member.user.displayName}</strong><small>{member.user.email}</small></div>
                <span className="status-chip">{member.role}</span>
              </div>
            ))}
            {members.length === 0 && <p className="empty-state">Nenhum membro cadastrado.</p>}
          </div>
        </article>

        {canReadAudit && (
          <article className="workspace-panel">
            <div className="panel-heading"><div><p className="eyebrow">RASTREABILIDADE</p><h2>Auditoria recente</h2></div></div>
            <div className="record-list">
              {auditEvents.map((event) => (
                <div className="record-row" key={event.id}>
                  <div><strong>{event.action}</strong><small>{event.resourceType} · {new Date(event.createdAt).toLocaleString('pt-BR')}</small></div>
                </div>
              ))}
              {auditEvents.length === 0 && <p className="empty-state">Nenhum evento registrado.</p>}
            </div>
          </article>
        )}
      </section>

      <footer>
        <span>© {new Date().getFullYear()} Tax Intelligence Brasil</span>
        <span>Produto independente. Sem vínculo ou endosso da Receita Federal.</span>
      </footer>
    </main>
  );
}
