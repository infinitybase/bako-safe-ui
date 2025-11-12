# Instruções de Code Review - Projeto Bako Safe UI

Este documento consolida todas as regras, padrões e boas práticas do projeto Bako Safe UI para serem usadas durante code reviews.

## Stack Tecnológico

- **Runtime**: Node.js
- **Linguagem**: TypeScript
- **Framework**: React 19
- **Build Tool**: Vite
- **Roteamento**: React Router v6
- **State Management**: Zustand, Jotai
- **Data Fetching**: TanStack Query (React Query)
- **Formulários**: React Hook Form + Yup
- **Blockchain**: Fuel SDK (@fuels/react)
- **Autenticação**: Privy
- **Testes E2E**: Playwright
- **Linter/Formatter**: ESLint + Prettier
- **Package Manager**: pnpm

## Arquitetura do Projeto

O projeto segue uma arquitetura modular baseada em features:

```
src/
├── components/          # Componentes reutilizáveis globais
├── modules/             # Módulos de features (cada feature é um módulo)
│   ├── [feature]/
│   │   ├── components/ # Componentes específicos da feature
│   │   ├── hooks/      # Hooks customizados
│   │   ├── pages/      # Páginas/views
│   │   ├── services/   # Serviços de API
│   │   ├── routes.tsx  # Rotas do módulo
│   │   └── index.ts    # Exports públicos
├── config/             # Configurações (API, query client, etc)
├── layouts/            # Layouts da aplicação
├── providers/          # Context providers
├── routes/             # Configuração de rotas principal
├── themes/             # Configurações de tema
└── utils/              # Funções utilitárias
```

## Boas Práticas TypeScript

### Declarações e Escopo

1. **SEMPRE** use `const` para valores imutáveis e `let` apenas quando houver reatribuição.
2. **NUNCA** use `var` - está obsoleto e causa problemas de escopo.
3. Declare variáveis próximas ao uso para reduzir escopo desnecessário.
4. Use type assertions com moderação, prefira inferência de tipos.

```typescript
const users = await userService.find({ status: 1 });
let currentIndex = 0;

// Evite type assertions desnecessárias
const response = await api.get('/users'); // TypeScript infere o tipo
```

### Tipagem

1. **SEMPRE** defina tipos explícitos para parâmetros de funções e retorno.
2. Use interfaces para objetos complexos e types para unions/intersections.
3. Evite `any` - use `unknown` quando o tipo for realmente desconhecido.
4. Prefira tipos sobre interfaces quando não houver necessidade de extensão.

```typescript
// BOM
interface IUserPayload {
  name: string;
  email: string;
  password: string;
}

async function createUser(payload: IUserPayload): Promise<User> {
  // implementação
}

// EVITE
async function createUser(payload: any): Promise<any> {
  // implementação
}
```

### Async/Await e Tratamento de Erros

1. **SEMPRE** envolva operações assíncronas em `try/catch`.
2. Use tratamento de erro apropriado com React Query ou error boundaries.
3. Inclua contexto relevante nos logs para rastreabilidade.
4. Propague erros apropriados para a camada de UI.

```typescript
async function fetchUserData(userId: string): Promise<User> {
  try {
    const user = await userService.findOne(userId);
    
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
```

### Imports e Path Aliases

1. Use `@/` para imports absolutos configurados no `tsconfig.json`.
2. Organize imports: externos primeiro, depois internos.
3. Evite imports circulares.

```typescript
// Imports externos
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// Imports internos
import { UserService } from '@/modules/user/services';
import type { IUserPayload } from '@/modules/user/types';
```

## Padrões de Nomeação

### Arquivos

- Utilize **kebab-case** para arquivos: `user-service.ts`, `payment-form.tsx`, `address-book.ts`
- Componentes React: **PascalCase** para arquivos: `UserCard.tsx`, `PaymentForm.tsx`
- Hooks: prefixo `use` e **camelCase**: `useUserData.ts`, `usePaymentForm.ts`
- Testes devem usar sufixo `.spec.ts`: `user.service.spec.ts`, `auth.hook.spec.ts`
- Nomes de arquivos devem ser descritivos e indicar claramente o propósito

```
✅ BOM
UserCard.tsx
useUserData.ts
payment-form.ts
address-book.service.ts

❌ EVITE
usr.tsx
user.ts
ps.ts
```

### Componentes React

- Componentes usam **PascalCase**: `UserCard`, `PaymentForm`, `AddressBook`
- Um componente por arquivo
- Nome do arquivo deve corresponder ao nome do componente

```typescript
// UserCard.tsx
export const UserCard = ({ user }: UserCardProps) => {
  return <div>{user.name}</div>;
};
```

### Hooks Customizados

- Hooks começam com `use`: `useUserData`, `usePaymentForm`, `useAddressBook`
- Arquivos em **camelCase**: `useUserData.ts`, `usePaymentForm.ts`

```typescript
// useUserData.ts
export const useUserData = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
};
```

### Services

- Services usam **PascalCase** e terminam com `Service`: `UserService`, `PaymentService`
- Arquivos em **kebab-case**: `user-service.ts`, `payment-service.ts`

```typescript
// user-service.ts
export class UserService {
  async findOne(id: string): Promise<User> {
    // implementação
  }
}
```

### Interfaces e Tipos

- Interfaces de payload recebem prefixo `I`: `IUserPayload`, `IPaymentData`, `IAddressBookItem`
- Tipos de props recebem sufixo `Props`: `UserCardProps`, `PaymentFormProps`
- Enums usam PascalCase com valores em UPPER_SNAKE_CASE ou camelCase conforme contexto:

```typescript
// Enums
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// Interfaces de payload
interface IUserPayload {
  name: string;
  email: string;
}

// Types de props
type UserCardProps = {
  user: User;
  onEdit?: (user: User) => void;
};
```

### Variáveis e Constantes

- Variáveis e funções: **camelCase** (`getUserById`, `currentUser`, `paymentStatus`)
- Constantes globais: **UPPER_SNAKE_CASE** (`DEFAULT_TIMEOUT_MS`, `MAX_RETRY_ATTEMPTS`)
- Propriedades privadas: prefixo `_` (`_service`, `_logger`)
- Booleans: prefixo `is`, `has`, `should` (`isActive`, `hasPermission`, `shouldRetry`)

```typescript
// BOM
const currentUser = await userService.findOne(id);
const isValid = validatePayload(data);
private _userService: UserService;
const MAX_ATTEMPTS = 3;

// EVITE
const u = await userService.findOne(id);
const valid = validatePayload(data);
private userService: UserService;
const maxAttempts = 3;
```

## Nomeação de Branches e Commits

### Branches

- Formato padrão: `categoria/descricao`
- Sempre escreva nomes em inglês, curtos e descritivos
- Categorias recomendadas:
  - `feature/` - Nova funcionalidade
  - `bugfix/` - Correção de bug
  - `hotfix/` - Correção crítica em produção
  - `chore/` - Manutenção, atualizações, etc
  - `refactor/` - Refatoração de código

```
✅ BOM
feature/pix-payment-integration
bugfix/user-authentication-error
hotfix/database-connection-timeout
chore/update-dependencies
refactor/payment-service-cleanup

❌ EVITE
feature/novaFunc
fix-bug
update
refatoracao-pagamento
```

### Commits

- Adote **Conventional Commits**: `tipo: descrição`
- Prefixos aceitos:
  - `feat:` - Nova funcionalidade
  - `fix:` - Correção de bug
  - `refactor:` - Refatoração sem alterar comportamento
  - `docs:` - Documentação
  - `test:` - Testes
  - `style:` - Formatação, linting
  - `chore:` - Manutenção, config, deps
  - `perf:` - Melhorias de performance
- Mensagens no imperativo em inglês
- Primeira letra minúscula após o prefixo
- Máximo 72 caracteres no título

```
✅ BOM
feat: add PIX payment support
fix: resolve user authentication timeout
refactor: simplify payment processing logic
chore: update dependencies
docs: update README with deployment instructions

❌ EVITE
Added pix payment
Fixed bug
Refatoração do serviço de pagamento
update
nova feature
```

## Componentes React

### Estrutura Básica

```typescript
import { useState } from 'react';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

export const UserCard = ({ user, onEdit }: UserCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.(user);
  };

  return (
    <div>
      <h3>{user.name}</h3>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};
```

### Regras Importantes

1. **SEMPRE** defina tipos para props usando interfaces ou types
2. Use componentes funcionais (não classes)
3. Use hooks para lógica reutilizável
4. Extraia lógica complexa para hooks customizados
5. Mantenha componentes pequenos e focados
6. Use `export const` para componentes nomeados
7. Prefira named exports sobre default exports

### Hooks Customizados

```typescript
// useUserData.ts
import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/modules/user/services';

export const useUserData = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => UserService.findOne(userId),
    enabled: !!userId,
  });
};
```

### Regras de Hooks

1. **SEMPRE** comece com `use` no nome
2. Use React Query para data fetching
3. Retorne objetos ou tuplas consistentes
4. Documente dependências e comportamento
5. Trate estados de loading e error

## React Query (TanStack Query)

### Estrutura Básica

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query
const { data, isLoading, error } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => UserService.findOne(userId),
  enabled: !!userId,
});

// Mutation
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: (payload: IUserPayload) => UserService.create(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

### Regras Importantes

1. **SEMPRE** use `queryKey` descritivos e consistentes
2. Use `enabled` para queries condicionais
3. Invalide queries após mutations
4. Use `queryClient` para cache management
5. Trate estados de loading e error adequadamente
6. Use `staleTime` e `cacheTime` apropriadamente

## Services (API Calls)

### Estrutura Básica

```typescript
// user-service.ts
import { request } from '@/utils/request';
import type { IUserPayload, User } from './types';

export class UserService {
  static async findOne(id: string): Promise<User> {
    const response = await request.get<User>(`/users/${id}`);
    return response.data;
  }

  static async create(payload: IUserPayload): Promise<User> {
    const response = await request.post<User>('/users', payload);
    return response.data;
  }

  static async update(id: string, payload: Partial<IUserPayload>): Promise<User> {
    const response = await request.put<User>(`/users/${id}`, payload);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await request.delete(`/users/${id}`);
  }
}
```

### Regras Importantes

1. **SEMPRE** use métodos estáticos para services
2. **SEMPRE** defina tipos de retorno
3. Use o helper `request` centralizado
4. Trate erros apropriadamente
5. Um service por módulo/feature
6. Organize métodos por recurso

## Rotas

### Estrutura Básica

```typescript
// routes.tsx
import { Route, Routes } from 'react-router-dom';
import { UserPage } from './pages/user';

export const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/users" element={<UserPage />} />
      <Route path="/users/:id" element={<UserDetailPage />} />
    </Routes>
  );
};
```

### Regras Importantes

1. **SEMPRE** defina rotas em arquivo `routes.tsx` do módulo
2. Use React Router v6
3. Organize rotas por feature/módulo
4. Use lazy loading para páginas grandes
5. Proteja rotas com autenticação quando necessário

## Formulários (React Hook Form + Yup)

### Estrutura Básica

```typescript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

type FormData = yup.InferType<typeof schema>;

export const UserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Regras Importantes

1. **SEMPRE** use React Hook Form para formulários
2. **SEMPRE** use Yup para validação
3. Defina schemas de validação separados
4. Use `yupResolver` para integração
5. Trate erros de validação na UI
6. Use tipos derivados do schema

## Testes (Playwright)

### Estrutura Básica

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/signin');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
  });
});
```

### Regras Importantes

1. Use Playwright para testes E2E
2. Organize testes em `tests/` na raiz
3. Use `describe` para agrupar testes relacionados
4. Use nomes descritivos para testes
5. Teste fluxos completos do usuário
6. Use page objects para elementos reutilizáveis

## Performance

1. Use `React.memo` para componentes pesados
2. Use `useMemo` e `useCallback` apropriadamente
3. Lazy load rotas e componentes grandes
4. Otimize imagens e assets
5. Use code splitting com Vite
6. Evite re-renders desnecessários
7. Use React Query para cache de dados

```typescript
// Lazy loading de rotas
const UserPage = lazy(() => import('@/modules/user/pages/user'));

// Memoização
const MemoizedComponent = React.memo(ExpensiveComponent);

// useMemo e useCallback
const expensiveValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

## Segurança

1. **NUNCA** exponha tokens ou chaves secretas no código
2. **SEMPRE** valide inputs do usuário
3. Use HTTPS para todas as requisições
4. Sanitize dados antes de exibir
5. Use Content Security Policy quando apropriado
6. Valide permissões antes de ações sensíveis
7. Não armazene dados sensíveis no localStorage sem criptografia

## Acessibilidade

1. Use elementos semânticos HTML
2. Adicione `aria-label` quando necessário
3. Garanta navegação por teclado
4. Use contraste adequado de cores
5. Teste com screen readers
6. Adicione `alt` text para imagens

```typescript
// BOM
<button aria-label="Close dialog" onClick={handleClose}>
  <CloseIcon />
</button>

// EVITE
<div onClick={handleClose}>
  <CloseIcon />
</div>
```

## Checklist de Code Review

Ao revisar código, verificar:

### Estrutura e Organização
- [ ] Arquivos na pasta correta (components, hooks, services, etc)
- [ ] Nomes de arquivos seguem convenções (kebab-case, PascalCase para componentes)
- [ ] Um arquivo por componente/hook/service
- [ ] Imports organizados (externos primeiro, depois internos)
- [ ] Uso de path aliases `@/` para imports absolutos

### Nomeação
- [ ] Componentes em PascalCase
- [ ] Hooks começam com `use` e estão em camelCase
- [ ] Services em PascalCase com sufixo `Service`
- [ ] Variáveis e funções em camelCase
- [ ] Constantes globais em UPPER_SNAKE_CASE
- [ ] Props types com sufixo `Props`
- [ ] Interfaces de payload com prefixo `I`
- [ ] Nomes descritivos e não genéricos

### TypeScript
- [ ] Tipos explícitos para parâmetros e retornos de funções
- [ ] Interfaces para objetos complexos
- [ ] Uso de `unknown` ao invés de `any` quando tipo é desconhecido
- [ ] Types derivados de schemas quando apropriado
- [ ] Evita type assertions desnecessárias

### Componentes React
- [ ] Componentes funcionais (não classes)
- [ ] Props tipadas com interfaces/types
- [ ] Componentes pequenos e focados
- [ ] Lógica complexa extraída para hooks
- [ ] Uso apropriado de `useMemo` e `useCallback`
- [ ] Tratamento de estados de loading e error

### Hooks
- [ ] Hooks começam com `use`
- [ ] Hooks customizados para lógica reutilizável
- [ ] Dependências corretas em arrays de dependência
- [ ] Sem violações das regras dos hooks

### React Query
- [ ] `queryKey` descritivos e consistentes
- [ ] `enabled` para queries condicionais
- [ ] Invalidação de queries após mutations
- [ ] Tratamento adequado de loading e error states

### Services
- [ ] Métodos estáticos
- [ ] Tipos de retorno definidos
- [ ] Uso do helper `request` centralizado
- [ ] Tratamento de erros apropriado

### Formulários
- [ ] React Hook Form para formulários
- [ ] Yup para validação
- [ ] Schemas de validação definidos
- [ ] Erros de validação tratados na UI

### Performance
- [ ] Uso apropriado de `React.memo`
- [ ] `useMemo` e `useCallback` quando necessário
- [ ] Lazy loading de rotas grandes
- [ ] Sem re-renders desnecessários

### Segurança
- [ ] Sem tokens ou chaves expostas
- [ ] Validação de inputs
- [ ] Sanitização de dados antes de exibir

### Acessibilidade
- [ ] Elementos semânticos HTML
- [ ] `aria-label` quando necessário
- [ ] Navegação por teclado funcional
- [ ] Contraste adequado

### Testes
- [ ] Testes E2E para fluxos críticos
- [ ] Testes isolados
- [ ] Nomes descritivos de testes

### Formatação
- [ ] Código formatado com Prettier
- [ ] Sem erros de lint (`pnpm lint`)
- [ ] Indentação consistente

### Git
- [ ] Commits seguem Conventional Commits
- [ ] Branch nomeada corretamente (feature/, bugfix/, etc)
- [ ] Mensagens de commit claras e em inglês
- [ ] Commits focados em uma alteração

---

## REGRAS PARA COMMITS

### FORMATO CONVENTIONAL COMMITS

Usamos o padrão Conventional Commits para padronizar as mensagens de commit.

### ESTRUTURA BÁSICA

```
<tipo>[escopo opcional]: <descrição>
```

**IMPORTANTE**: Todos os commits devem ter APENAS UMA LINHA na mensagem. Não usar corpo ou rodapé.

### TIPOS DE COMMIT

- `feat`: Uma nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças apenas na documentação
- `style`: Mudanças que não afetam o significado do código (espaços, formatação, etc.)
- `refactor`: Mudança de código que não corrige bug nem adiciona funcionalidade
- `perf`: Mudança de código que melhora performance
- `test`: Adição ou correção de testes
- `chore`: Mudanças no processo de build ou ferramentas auxiliares
- `ci`: Mudanças em arquivos de configuração de CI
- `build`: Mudanças que afetam o sistema de build ou dependências externas

### ESCOPOS SUGERIDOS

- `ui`: Mudanças na interface/componentes
- `auth`: Mudanças na autenticação
- `api`: Mudanças em chamadas de API
- `tests`: Mudanças específicas em testes
- `config`: Mudanças em configurações
- `docs`: Mudanças na documentação
- `deps`: Mudanças em dependências

### REGRAS DE MENSAGEM

1. **APENAS UMA LINHA**: Nunca usar múltiplas linhas, corpo ou rodapé
2. Usar **inglês** para as mensagens
3. Máximo **72 caracteres** na linha única
4. Usar modo **imperativo**: "add" ao invés de "added"
5. **Não** terminar com ponto final
6. Ser claro e descritivo em uma única linha

### EXEMPLOS VÁLIDOS

```
feat(ui): add user profile card component
fix(auth): resolve token expiration validation
test(api): add coverage for error handling
docs: update README with setup instructions
chore(deps): update dependencies
refactor(ui): improve component structure
perf(api): optimize data fetching with React Query
style: adjust code formatting according to lint rules
```

### EXEMPLOS INVÁLIDOS

```
❌ Update files
❌ fix bug
❌ Added new feature for user authentication.
❌ WIP: working on tests
❌ feat: add very long feature description that exceeds character limit
```

### COMMITS DE BREAKING CHANGES

Para mudanças que quebram compatibilidade, use `!` após o tipo/escopo (AINDA EM UMA LINHA):

```
feat(api)!: remove legacy authentication endpoint and add v2
```

### COMMITS COMPLEXOS

Para mudanças complexas, seja conciso em uma única linha descritiva:

```
feat(tests): add complete E2E test infrastructure
refactor(ui): implement component composition pattern
chore(deps): update all dependencies and configure coverage
```

### FERRAMENTAS

- Use `git log --oneline` para verificar o histórico
- Configure hooks de pre-commit para validar formato (já configurado com Husky)

### DICAS

1. **SEMPRE UMA LINHA**: Jamais use múltiplas linhas nos commits
2. **Commit pequeno e frequente**: Prefira commits pequenos e focados
3. **Uma mudança por commit**: Cada commit deve representar uma mudança lógica
4. **Teste antes de commitar**: Garanta que os testes passem
5. **Revise antes de push**: Use `git log --oneline -10` para revisar commits

---

## PADRÃO DE CRIAÇÃO DE COMPONENTES REACT

### OBJETIVO

Definir um padrão unificado para criação de componentes React, garantindo consistência, previsibilidade e aderência a boas práticas.

### ESTRUTURA BÁSICA DE COMPONENTES

#### IMPORTAÇÕES OBRIGATÓRIAS

```typescript
import { useState, useEffect } from 'react';
import type { ComponentProps } from 'react';
```

#### ESTRUTURA MÍNIMA

```typescript
interface ComponentNameProps {
  // Props aqui
}

export const ComponentName = ({ prop1, prop2 }: ComponentNameProps) => {
  // Lógica do componente
  return <div>Content</div>;
};
```

### CONVENÇÕES DE NOMENCLATURA

#### COMPONENTES

- **PascalCase** para nomes de componentes
- Descritivo e claro
- Um componente por arquivo

#### PROPRIEDADES

- **camelCase** para propriedades
- Prefixo `on` para callbacks: `onClick`, `onSubmit`, `onChange`
- Prefixo `is`, `has`, `should` para booleans: `isActive`, `hasError`, `shouldShow`

#### ARQUIVOS

- **PascalCase** para arquivos de componentes: `UserCard.tsx`, `PaymentForm.tsx`
- Nome do arquivo deve corresponder ao nome do componente

### EXEMPLO COMPLETO

```typescript
// UserCard.tsx
import { useState } from 'react';
import type { User } from '@/modules/user/types';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  isEditable?: boolean;
}

export const UserCard = ({ 
  user, 
  onEdit, 
  onDelete, 
  isEditable = false 
}: UserCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    onEdit?.(user);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete?.(user.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {isEditable && (
        <div>
          <button onClick={handleEdit} disabled={isLoading}>
            Edit
          </button>
          <button onClick={handleDelete} disabled={isLoading}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
```

### BOAS PRÁTICAS DE COMPONENTES

1. **SEMPRE** defina tipos para props usando interfaces
2. **SEMPRE** use componentes funcionais (não classes)
3. **SEMPRE** extraia lógica complexa para hooks customizados
4. **SEMPRE** mantenha componentes pequenos e focados
5. **SEMPRE** use `export const` para componentes nomeados
6. **NUNCA** use `any` como tipo
7. **NUNCA** coloque lógica de negócio diretamente no componente
8. Use default values para props opcionais quando apropriado
9. Use destructuring para props
10. Prefira named exports sobre default exports

---

## PADRÃO DE CRIAÇÃO DE HOOKS CUSTOMIZADOS

### OBJETIVO

Definir um padrão unificado para criação de hooks customizados, garantindo consistência e reutilização.

### ESTRUTURA BÁSICA DE HOOKS

#### IMPORTAÇÕES OBRIGATÓRIAS

```typescript
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
```

#### ESTRUTURA MÍNIMA

```typescript
export const useCustomHook = (param: string) => {
  // Lógica do hook
  return { data, isLoading, error };
};
```

### CONVENÇÕES DE NOMENCLATURA

#### HOOKS

- **SEMPRE** começam com `use`
- **camelCase** para nomes: `useUserData`, `usePaymentForm`
- Descritivo e claro sobre o propósito

#### ARQUIVOS

- **camelCase** para arquivos: `useUserData.ts`, `usePaymentForm.ts`
- Um hook por arquivo (exceto quando relacionados)

### EXEMPLO COMPLETO

```typescript
// useUserData.ts
import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/modules/user/services';
import type { User } from '@/modules/user/types';

export const useUserData = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => UserService.findOne(userId!),
    enabled: !!userId,
  });
};
```

### BOAS PRÁTICAS DE HOOKS

1. **SEMPRE** comece com `use` no nome
2. **SEMPRE** use React Query para data fetching
3. **SEMPRE** retorne objetos ou tuplas consistentes
4. **SEMPRE** documente dependências e comportamento
5. **SEMPRE** trate estados de loading e error
6. **NUNCA** viole as regras dos hooks do React
7. Use `enabled` para queries condicionais
8. Invalide queries após mutations quando apropriado
9. Mantenha hooks focados em uma responsabilidade
10. Reutilize hooks existentes quando possível

---

Este documento deve ser consultado durante code reviews para garantir consistência e qualidade do código.

