# Sistema de Cache

Este documento explica como funciona o sistema de cache para metadados de tokens, NFTs, Bako ID e imagens no Bako Safe.

## Por que Cache Permanente?

Metadados de assets na blockchain são **imutáveis**:
- Nome, símbolo e decimais nunca mudam após criação
- Metadata de NFTs (URI, imagem) são fixos
- Handles do Bako ID raramente mudam

Por isso, usamos `staleTime: Infinity` - uma vez buscado, o dado é válido para sempre (com possibilidade de invalidação manual quando necessário).

## Arquitetura

O sistema utiliza uma abordagem **cache-first** com **deduplicação de requests**:

```
┌─────────────────────────────────────────────────────────────┐
│                     Componente React                         │
│               (useAssetMetadata, useGetAssetsMetadata)       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     React Query Cache                        │
│          (initialData + enabled: !hasCachedData)            │
│                    (staleTime: Infinity)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                    (query só executa se não há cache)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Zustand Store + LocalStorage              │
│              (persistência permanente automática)            │
│        + Deduplicação de Requests (pendingRequests Map)      │
└─────────────────────────────────────────────────────────────┘
                              │
                    (request só acontece se não está em cache
                     E não há request pendente para esse ID)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      APIs Externas                           │
│  - Fuel Explorer (mainnet/testnet)                          │
│  - IPFS Gateway (para NFTs)                                  │
└─────────────────────────────────────────────────────────────┘
```

## Princípio Cache-First

O sistema segue o princípio **"se está em cache, não faz request"**:

```typescript
// Exemplo simplificado do fluxo
const cachedData = store.mappedTokens[assetId];
const hasCachedData = !!cachedData;

const { data } = useQuery({
  queryKey: ['assetMetadata', assetId],
  queryFn: async () => { /* fetch da API */ },
  // A queryFn SÓ executa se enabled=true
  enabled: !!assetId && !hasCachedData,
  // Dados do cache são usados imediatamente
  initialData: cachedData,
  staleTime: Number.POSITIVE_INFINITY,
});
```

**Resultado:** Se o dado existe no localStorage (via Zustand), **nenhuma request é feita**.

## Deduplicação de Requests

Para evitar requests duplicadas quando múltiplos componentes solicitam o mesmo asset simultaneamente:

```typescript
// Mapa global de requests em andamento
const pendingTokenRequests: Map<string, Promise<AssetMap[''] | null>> = new Map();

// No fetchAssets:
// 1. Verifica cache local (não faz request)
// 2. Verifica se já há request pendente para este ID
// 3. Só cria nova request se não está em cache E não há request pendente
```

**Cenário protegido:**
```
Componente A solicita asset X ─────┐
Componente B solicita asset X ─────┼─→ Apenas 1 request é feita
Componente C solicita asset X ─────┘   (B e C reutilizam a Promise de A)
```

## Camadas de Cache

### 1. React Query (Memória)

**Configuração:**
- `staleTime: Infinity` - Dados nunca expiram (metadados são imutáveis)
- `refetchOnWindowFocus: false` - Não refaz requisição ao focar na janela
- `refetchOnMount: false` - Não refaz requisição ao montar componente
- `refetchOnReconnect: false` - Não refaz requisição ao reconectar
- `initialData: cachedData` - Usa dados do Zustand/localStorage imediatamente
- `enabled: !hasCachedData` - **Não executa queryFn se já tem cache**

**Quando refetch acontece:**
- Nunca automaticamente (dados imutáveis + cache-first)
- Apenas se o usuário limpar cache manualmente

### 2. Zustand Store (Memória + LocalStorage)

**Localização:** `src/modules/assets-tokens/hooks/useAssetMap.ts`

**Stores:**
- `mappedTokens` - Cache de tokens fungíveis
- `mappedNfts` - Cache de NFTs

**Persistência:** LocalStorage com chave `FUEL_MAPPED_ASSETS`

**Comportamento:**
- Dados persistem entre sessões do navegador
- Sem expiração automática (válido até limpeza manual)
- **Usado como `initialData` no React Query** - evita requests

### 3. Request Deduplication Layer

**Localização:** `src/modules/assets-tokens/hooks/useAssetMap.ts`

**Maps globais:**
- `pendingTokenRequests` - Requests de tokens em andamento
- `pendingNftRequests` - Requests de NFTs em andamento

**Comportamento:**
- Antes de criar request, verifica se já existe uma pendente
- Se existe, reutiliza a mesma Promise
- Remove do Map após conclusão (success ou error)

## Fluxo de Busca Detalhado

### fetchAssets (Tokens)

```typescript
fetchAssets(assetIds, chainId)
```

1. **Verifica cache local** (`mappedTokens`)
   - Assets em cache → retorna imediatamente
   - Assets não em cache → continua

2. **Verifica requests pendentes** (`pendingTokenRequests`)
   - Se há request pendente para um ID → aguarda essa Promise
   - Se não há → cria nova request

3. **Cria requests apenas para IDs únicos**
   - Registra no Map de pendentes
   - Remove após conclusão

4. **Atualiza store** com novos dados

5. **Retorna todos** (cached + fetched + from pending)

```
Entrada: [asset1, asset2, asset3, asset4]
         ↓
Cache hit: [asset1, asset3] ─────────────────────┐
Pending: [asset2] (já em request) ───────────────┼─→ Resultado final
Cache miss: [asset4] ─→ Nova API request ────────┘
```

### fetchNfts (NFTs)

Mesmo fluxo de `fetchAssets`, com etapas adicionais:
- Verifica se é NFT (`isNFT`, `totalSupply === '1'`)
- Se não tem metadata nativa, busca do IPFS (timeout: 3s)
- Usa `pendingNftRequests` para deduplicação

## Cache do Bako ID

O cache de handles e resolvers do Bako ID usa a mesma arquitetura cache-first.

### Zustand Store Dedicado

**Localização:** `src/modules/core/hooks/bako-id/useBakoIDClient.ts`

**Store:** `useBakoIDCacheStore`

**Dados armazenados:**
- `addressToName` - Mapeamento endereço → nome
- `nameToAddress` - Mapeamento nome → endereço
- `avatars` - URLs de avatares por nome
- `batchNames` - Resultados de resolução em lote

**Persistência:** LocalStorage com chave `BAKO_ID_CACHE`

### Hooks com Cache-First

| Hook | Descrição | Cache Key |
|------|-----------|-----------|
| `useBakoIDResolveNames` | Resolve múltiplos endereços | `batchNames[sorted addresses]` |
| `useResolverNameQuery` | Resolve endereço → handle | `addressToName[address]` |
| `useResolverAddressQuery` | Resolve handle → endereço | `nameToAddress[name]` |
| `useBakoIdAvatar` | Busca avatar | `avatars[name]` |

### Configuração

Todos os hooks usam:

```typescript
const BAKO_ID_CACHE_CONFIG = {
  staleTime: Number.POSITIVE_INFINITY,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
};

// + cache-first logic:
const cachedData = cache.getNameByAddress(address);
const hasCachedData = cachedData !== undefined;

const { data } = useQuery({
  queryFn: async () => { /* ... */ },
  enabled: !hasCachedData && (options.enabled ?? true),
  initialData: cachedData ?? undefined,
  ...BAKO_ID_CACHE_CONFIG,
});
```

## Cache de Imagens (Avatars/PFPs)

O sistema inclui cache de imagens usando a Cache API do browser para avatares e profile pictures.

### Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                  useCachedImage Hook                        │
│              (React Query + Cache API)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cache API (Browser)                       │
│               Cache Name: bako-safe-images-v1               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    URLs Remotas                              │
│              (IPFS, Bako ID, etc.)                          │
└─────────────────────────────────────────────────────────────┘
```

### Hook useCachedImage

```typescript
import { useCachedImage } from '@/modules/core/hooks/useCachedImage';

const { src, isFromCache, isLoading } = useCachedImage(avatarUrl);

// Use src diretamente no img
<img src={src} alt="Avatar" />
```

## Hooks Disponíveis

### useAssetMetadata

```typescript
const { asset, isLoading, error } = useAssetMetadata(assetId);
```

Busca metadata de um único asset. **Cache-first:** se existe no Zustand, não faz request.

### useGetAssetsMetadata

```typescript
const { assets, isLoading, error } = useGetAssetsMetadata(assetIds);
```

Busca metadata de múltiplos assets em paralelo.

**Otimizações:**
- Query key estabilizada (array ordenado)
- Busca tokens e NFTs em paralelo
- **Cache-first:** só faz request para assets não cacheados
- **Deduplicação:** não faz requests duplicadas

### useAssetMap

```typescript
const { assetList, nftList, assetsMap, getAssetInfo } = useAssetMap(chainId);
```

Acesso direto ao store de assets.

## Performance

### Antes das Otimizações

```
10 assets → 10 requisições SEQUENCIAIS
Tempo: ~500ms × 10 = ~5 segundos
Requests repetidas: SIM (race conditions)
```

### Depois das Otimizações

```
10 assets (5 em cache) → 5 requisições PARALELAS
Tempo: ~500ms (máximo do lote)
Requests repetidas: NÃO (deduplicação)
```

**Melhorias:**
- ~90% redução no tempo de carregamento
- 0 requests para dados em cache (localStorage)
- 0 requests duplicadas (deduplicação por Map)

## Garantias do Sistema

### 1. Não faz request se tem cache

```typescript
// O React Query NÃO executa queryFn quando:
enabled: !hasCachedData  // false quando tem cache
```

### 2. Não faz requests duplicadas

```typescript
// Antes de criar request, verifica:
if (pendingTokenRequests.has(assetId)) {
  // Reutiliza Promise existente, não cria nova request
}
```

### 3. Persistência entre sessões

```typescript
// Zustand persist middleware salva automaticamente no localStorage
persist<Store>(
  (set, get) => ({ /* store */ }),
  { name: 'bakosafe/fuel-mapped-assets' }
)
```

## Invalidação Manual de Cache

Para casos raros onde seja necessário forçar atualização dos dados.

### Assets (Tokens/NFTs)

```typescript
import { invalidateAssetCache } from '@/modules/assets-tokens/hooks/useAssetMap';

// Limpar todo o cache de assets
invalidateAssetCache.all();

// Limpar apenas tokens
invalidateAssetCache.tokens();

// Limpar apenas NFTs
invalidateAssetCache.nfts();

// Limpar um asset específico
invalidateAssetCache.asset(assetId);
```

### Bako ID (Handles/Resolvers)

```typescript
import { invalidateBakoIDCache } from '@/modules/core/hooks/bako-id';

// Limpar todo o cache do Bako ID
invalidateBakoIDCache.all();

// Limpar cache de um endereço específico
invalidateBakoIDCache.address(address);

// Limpar cache de um nome/handle específico
invalidateBakoIDCache.name(name);

// Limpar avatar de um nome
invalidateBakoIDCache.avatar(name);

// Limpar múltiplos endereços
invalidateBakoIDCache.addresses(['0x...', '0x...']);
```

### Imagens (Avatars/PFPs)

```typescript
import { clearImageCache, imageCache } from '@/modules/core/utils/image-cache';

// Limpar todo o cache de imagens
await clearImageCache();

// Limpar uma imagem específica
await imageCache.remove(imageUrl);
```

## Versionamento de Cache

O cache usa versionamento para migrações automáticas:

```typescript
// Em useAssetMap.ts
{
  name: localStorageKeys.FUEL_MAPPED_ASSETS,
  version: 1, // Incrementar para forçar limpeza em todos os usuários
  migrate: (persistedState, version) => {
    if (version < 1) {
      return { ...state, mappedTokens: {}, mappedNfts: {} };
    }
    return state;
  },
}
```

## APIs Utilizadas

### Fuel Explorer

| Chain | Endpoint |
|-------|----------|
| Mainnet (9889) | `https://mainnet-explorer.fuel.network/assets/{assetId}` |
| Testnet (0) | `https://explorer-indexer-testnet.fuel.network/assets/{assetId}` |

### IPFS Gateway

**Endpoint:** `https://ipfs.io/ipfs/{hash}`
**Timeout:** 3 segundos

## Troubleshooting

### Asset não aparece

1. Verifique se o `assetId` está correto
2. Verifique conexão com Fuel Explorer
3. Para debug, limpe LocalStorage e recarregue

### IPFS timeout

- Timeout padrão: 3 segundos
- Se IPFS falhar, usa metadata do Explorer como fallback
- NFTs podem aparecer sem imagem temporariamente

### Verificar cache no DevTools

```javascript
// No console do browser:

// Ver cache de assets
JSON.parse(localStorage.getItem('bakosafe/fuel-mapped-assets'))

// Ver cache do Bako ID
JSON.parse(localStorage.getItem('bakosafe/bako-id-cache'))
```
