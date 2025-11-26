# Sistema de Cache

Este documento explica como funciona o sistema de cache para metadados de tokens, NFTs, Bako ID e imagens no Bako Safe.

## Por que Cache Permanente?

Metadados de assets na blockchain são **imutáveis**:
- Nome, símbolo e decimais nunca mudam após criação
- Metadata de NFTs (URI, imagem) são fixos
- Handles do Bako ID raramente mudam

Por isso, usamos `staleTime: Infinity` - uma vez buscado, o dado é válido para sempre (com possibilidade de invalidação manual quando necessário).

## Arquitetura

O sistema utiliza **duas camadas de cache**:

```
┌─────────────────────────────────────────────────────────────┐
│                     React Query Cache                        │
│                    (staleTime: Infinity)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Zustand Store + LocalStorage              │
│                    (persistência permanente)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      APIs Externas                           │
│  - Fuel Explorer (mainnet/testnet)                          │
│  - IPFS Gateway (para NFTs)                                  │
└─────────────────────────────────────────────────────────────┘
```

## Camadas de Cache

### 1. React Query (Memória)

**Configuração:**
- `staleTime: Infinity` - Dados nunca expiram (metadados são imutáveis)
- `refetchOnWindowFocus: false` - Não refaz requisição ao focar na janela
- `refetchOnMount: false` - Não refaz requisição ao montar componente
- `refetchOnReconnect: false` - Não refaz requisição ao reconectar

**Quando refetch acontece:**
- Nunca automaticamente (dados imutáveis)
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

## Fluxo de Busca

### fetchAssets (Tokens)

```typescript
fetchAssets(assetIds, chainId)
```

1. Verifica quais assets já estão em cache (`mappedTokens`)
2. Separa em: `cachedAssets` e `uncachedIds`
3. Busca apenas os não-cacheados em **paralelo** (Promise.all)
4. Atualiza o store com os novos dados
5. Retorna todos os assets (cached + fetched)

```
Entrada: [asset1, asset2, asset3, asset4]
         ↓
Cache hit: [asset1, asset3] ──────────────────┐
Cache miss: [asset2, asset4] ─→ API (paralelo) ┼─→ Resultado final
                                              │
                              ←───────────────┘
```

### fetchNfts (NFTs)

```typescript
fetchNfts(assetIds, chainId)
```

Mesmo fluxo de `fetchAssets`, com etapa adicional:
- Se NFT não tem metadata nativa, busca do IPFS (timeout: 3s)

## APIs Utilizadas

### Fuel Explorer

| Chain | Endpoint |
|-------|----------|
| Mainnet (9889) | `https://mainnet-explorer.fuel.network/assets/{assetId}` |
| Testnet (0) | `https://explorer-indexer-testnet.fuel.network/assets/{assetId}` |

**Dados retornados:**
- `name` - Nome do asset
- `symbol` - Símbolo (ex: ETH, USDC)
- `decimals` - Casas decimais
- `isNFT` - Se é NFT
- `totalSupply` - Supply total
- `metadata` - Metadados adicionais (URI, imagem, etc.)

### IPFS Gateway

**Endpoint:** `https://ipfs.io/ipfs/{hash}`

**Quando é chamado:**
- Apenas para NFTs
- Quando `metadata.uri` existe
- Quando não há metadata nativa suficiente

**Timeout:** 3 segundos

## Cache do Bako ID

O cache de handles e resolvers do Bako ID segue a mesma estratégia de cache permanente.

### Hooks com Cache

| Hook | Descrição |
|------|-----------|
| `useBakoIDResolveNames` | Resolve múltiplos endereços para handles |
| `useResolverNameQuery` | Resolve um endereço para handle |
| `useResolverAddressQuery` | Resolve um handle para endereço |
| `useBakoIdAvatar` | Busca avatar de um handle |

### Configuração

Todos os hooks usam:

```typescript
const BAKO_ID_CACHE_CONFIG = {
  staleTime: Number.POSITIVE_INFINITY,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
};
```

### Quando Invalidar

O cache do Bako ID só precisa ser invalidado manualmente quando:
- O usuário alterou seu handle/nome
- O usuário atualizou seu avatar
- Verificação manual é necessária

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

**Comportamento:**
1. Verifica se imagem está no Cache API
2. Se sim, retorna blob URL local (offline)
3. Se não, baixa a imagem e armazena no cache
4. Retorna blob URL para uso imediato

**Vantagens:**
- Imagens disponíveis offline
- Carregamento instantâneo em visitas subsequentes
- Redução de requisições de rede

### Preload de Imagens

```typescript
import { preloadImages } from '@/modules/core/hooks/useCachedImage';

// Precarregar avatares de uma lista de usuários
await preloadImages(users.map(u => u.avatarUrl));
```

### Versionamento do Cache de Imagens

O cache de imagens usa versionamento via `BAKO_IMAGE_CACHE_VERSION` no localStorage.
Para forçar atualização em todos os usuários:

```typescript
// Em src/modules/core/utils/image-cache.ts
const CACHE_VERSION = 2; // Incrementar este número
```

## Hooks Disponíveis

### useAssetMetadata

```typescript
const { asset, isLoading, error } = useAssetMetadata(assetId);
```

Busca metadata de um único asset.

### useGetAssetsMetadata

```typescript
const { assets, isLoading, error } = useGetAssetsMetadata(assetIds);
```

Busca metadata de múltiplos assets em paralelo.

**Otimizações:**
- Query key estabilizada (array ordenado)
- Busca tokens e NFTs em paralelo

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
```

### Depois das Otimizações

```
10 assets → 10 requisições PARALELAS
Tempo: ~500ms (máximo do lote)
```

**Redução:** ~90% no tempo de carregamento para múltiplos assets

## Invalidação Manual de Cache

Para casos raros onde seja necessário forçar atualização dos dados, utilize as funções de invalidação manual.

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

O cache usa versionamento para migrações automáticas e suaves:

```typescript
// Em useAssetMap.ts
{
  name: localStorageKeys.FUEL_MAPPED_ASSETS,
  version: 1, // Incrementar para forçar limpeza do cache em todos os usuários
  migrate: (persistedState, version) => {
    if (version < 1) {
      return { ...state, mappedTokens: {}, mappedNfts: {} };
    }
    return state;
  },
}
```

**Para forçar atualização em todos os usuários:**
1. Incremente o número da versão
2. A migração limpa o cache automaticamente
3. O usuário não percebe - dados são buscados novamente em background

## Troubleshooting

### Asset não aparece

1. Verifique se o `assetId` está correto
2. Verifique conexão com Fuel Explorer
3. Para debug, limpe LocalStorage e recarregue

### IPFS timeout

- Timeout padrão: 3 segundos
- Se IPFS falhar, usa metadata do Explorer como fallback
- NFTs podem aparecer sem imagem temporariamente

## Configuração

### Alterar timeout IPFS

```typescript
// Em useAssetMap.ts, dentro de fetchNfts
const data = await requestWithTimeout(url, 3000); // 3 segundos
```
