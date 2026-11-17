'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, apiRequest } from '@/lib/api';

type OrganizationChoice = { id: string; name: string; role: string };
type AuthResponse = { user: { email: string; displayName: string }; organization: { id: string; name: string } };

function organizationsFromError(error: ApiError): OrganizationChoice[] {
  if (typeof error.payload !== 'object' || error.payload === null || !('organizations' in error.payload)) return [];
  const value = error.payload.organizations;
  return Array.isArray(value) ? value as OrganizationChoice[] : [];
}

export default function LoginPage() {
  const router = useRouter();
  const [registerMode, setRegisterMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizations, setOrganizations] = useState<OrganizationChoice[]>([]);
  const [organizationId, setOrganizationId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setErrorMessage('');
    try {
      if (registerMode) {
        await apiRequest<AuthResponse>('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ displayName, organizationName, email, password }),
        });
      } else {
        await apiRequest<AuthResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            ...(organizationId ? { organizationId } : {}),
          }),
        });
      }
      router.replace('/');
    } catch (error) {
      if (error instanceof ApiError) {
        const choices = organizationsFromError(error);
        if (choices.length > 0) {
          setOrganizations(choices);
          setErrorMessage('Esta conta participa de mais de uma organização. Escolha em qual deseja entrar.');
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage('Não foi possível conectar à plataforma. Verifique se a API está disponível.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-layout">
      <a className="brand auth-brand" href="/">
        <span className="brand-mark">TI</span>
        <span>TAX INTELLIGENCE <b>BRASIL</b></span>
      </a>
      <section className="auth-card">
        <p className="eyebrow">{registerMode ? 'COMECE SUA OPERAÇÃO' : 'ACESSO À PLATAFORMA'}</p>
        <h1>{registerMode ? 'Crie sua conta.' : 'Bem-vindo de volta.'}</h1>
        <p className="auth-description">
          {registerMode
            ? 'Cadastre seu usuário e a primeira organização.'
            : 'Entre para acessar empresas, cálculos e documentos fiscais.'}
        </p>

        <form className="auth-form" onSubmit={submit}>
          {registerMode && (
            <>
              <label>Nome completo<input autoComplete="name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} required minLength={2} maxLength={120} /></label>
              <label>Nome da organização<input autoComplete="organization" value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} required minLength={2} maxLength={160} /></label>
            </>
          )}
          <label>E-mail<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Senha<input type="password" autoComplete={registerMode ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={12} maxLength={128} /></label>

          {organizations.length > 0 && (
            <label>Organização
              <select value={organizationId} onChange={(event) => setOrganizationId(event.target.value)} required>
                <option value="">Selecione uma organização</option>
                {organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>{organization.name} · {organization.role}</option>
                ))}
              </select>
            </label>
          )}

          {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
          <button className="primary-button" type="submit" disabled={busy}>
            {busy ? 'Aguarde...' : registerMode ? 'Criar conta e organização' : organizations.length > 0 ? 'Entrar na organização' : 'Entrar'}
          </button>
        </form>

        <button className="text-button" type="button" onClick={() => {
          setRegisterMode(!registerMode);
          setOrganizations([]);
          setOrganizationId('');
          setErrorMessage('');
        }}>
          {registerMode ? 'Já possui uma conta? Entrar' : 'Ainda não possui conta? Criar acesso'}
        </button>
      </section>
      <p className="auth-footnote">Produto independente. Não representa nem substitui os sistemas oficiais da Receita Federal.</p>
    </main>
  );
}
