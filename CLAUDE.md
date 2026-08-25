# Gala Soccer — E-commerce de Camisetas de Futebol

## Sobre o projeto

Loja virtual (Gala Soccer) para venda de camisetas de futebol — clubes nacionais,
clubes internacionais e seleções. Cliente: **Tech Visions**.

Fase atual: scaffold inicial do Next.js criado, implementação em andamento.

## Escopo (fase 1)

- E-commerce web completo (catálogo, carrinho, checkout, pagamento).
- Sem app mobile nativo por enquanto.
- Painel administrativo próprio para cadastro de produtos e controle de estoque
  (manual, sem integração com fornecedor/dropshipping).
- Pagamentos focados no mercado brasileiro: Pix, boleto e cartão via Mercado Pago.

## Stack técnica

- **Framework**: Next.js 15 (App Router), TypeScript, monolito full-stack
  (sem backend separado — Route Handlers / Server Actions no próprio Next.js).
- **UI**: Tailwind CSS + shadcn/ui.
- **Banco de dados**: PostgreSQL via Supabase.
- **ORM**: Prisma.
- **Autenticação**: Supabase Auth (clientes + área `/admin` protegida por role).
- **Pagamentos**: Mercado Pago (Checkout Pro/Transparente) — Pix, boleto, cartão.
- **Storage**: Supabase Storage (imagens de produto).
- **E-mail transacional**: Resend (confirmação de pedido, recuperação de senha).
- **Validação**: Zod (schemas compartilhados entre formulário e API).
- **Hospedagem**: Vercel.

## Identidade visual

Logo: escudo circular em verde escuro com coroa e tipografia dourada/champanhe.
Paleta definida como **tokens de cor semânticos** (CSS variables em
`src/app/globals.css`, mapeados no `tailwind.config`/`@theme`) em vez de cores
fixas espalhadas pelo código — a marca ainda pode ajustar os tons exatos depois
sem precisar caçar cada uso:

- `--brand-primary` — verde escuro (fundo, cabeçalho, botões primários).
- `--brand-accent` — dourado/champanhe (destaques, ícones, texto de marca).
- `--brand-foreground` — texto sobre fundo escuro (branco/off-white).

Qualquer componente deve usar essas classes semânticas (`bg-brand-primary`,
`text-brand-accent`, etc.), nunca `bg-green-800` ou hex direto.

`SiteHeader` é `sticky` (fica fixo ao rolar). Existem dois footers: `SiteFooter`
(completo, 4 colunas) só nas páginas de navegação/descoberta (home, produto,
time); `SiteFooterCompact` (uma linha, copyright + pagamento) em todas as
páginas utilitárias/transacionais (carrinho, checkout, conta, login, cadastro)
pra não ocupar espaço desproporcional em telas de fluxo curto.

## Modelo de dados

Implementado em [`prisma/schema.prisma`](prisma/schema.prisma) — essa é a fonte de
verdade a partir de agora, não esta lista:

- `Team` — time/seleção (nome, escudo, categoria: Nacional/Internacional/Seleção).
- `Product` / `ProductImage` — camiseta (time, temporada, tipo — titular/reserva/
  terceira/retrô/goleiro).
- `ProductVariant` — tamanho (P/M/G/GG/XG) + preço + estoque.
- `Customer` / `Address` — cliente final e endereços de entrega.
- `Order` / `OrderItem` — pedido e itens.
- `Payment` — status e referência da transação Mercado Pago.
- `Review` — avaliação com nota (1-5) e comentário. **Compra verificada**: só
  quem tem um `Order` com status `DELIVERED` contendo aquele produto pode
  avaliar (checado pelo e-mail informado, sem precisar de login — mesmo padrão
  guest do checkout). Único por produto+cliente (não dá pra avaliar 2x).
- `Admin` — usuário do painel administrativo.

**Prisma 7**: a connection string do datasource não vai mais no `schema.prisma`
(`url` foi removido de lá). O client em runtime usa um *driver adapter*
(`@prisma/adapter-pg`, ver [`src/lib/prisma.ts`](src/lib/prisma.ts)), e o CLI/Migrate
lê a URL de [`prisma7.config.ts`](prisma7.config.ts). O client gerado vai para
`src/generated/prisma` (gitignored — rodar `npx prisma generate` após clonar).

## Estrutura de pastas

```
src/
  app/            # rotas (App Router)
    admin/        # painel administrativo (CRUD de times e produtos, sem auth ainda)
      teams/      # listar/criar times
      products/   # listar/criar produtos (com variantes por tamanho)
    produtos/[slug]/  # página individual do produto (dados reais, seletor de tamanho)
    page.tsx      # home da loja (dados reais via lib/products.ts)
  components/     # componentes de UI compartilhados
  lib/            # clients e utilitários (prisma.ts, slugify.ts, products.ts,
                  # format.ts, enum-labels.ts, category-visuals.ts)
  generated/      # código gerado (Prisma Client) — gitignored
prisma/
  schema.prisma   # modelo de dados
```

**Admin (`/admin`)**: CRUD funcional de Times, Produtos e visualização de Pedidos
direto no Supabase via Server Actions (`teams/actions.ts`, `products/actions.ts`),
validado com Zod. Lista de produtos tem filtro por time/tipo/status via query
string (form GET, sem JS client-side). **Protegido por login** (`/admin/login`,
Supabase Auth) — separado do login de cliente, checado contra a tabela `Admin`
do Prisma (não basta logar no Supabase, o e-mail precisa estar cadastrado como
Admin — `lib/current-admin.ts#getCurrentAdmin`). As rotas protegidas ficam no
route group `app/admin/(dashboard)/`, cujo `layout.tsx` faz o `redirect` pra
`/admin/login` se não autenticado; `app/admin/login/` fica fora do grupo de
propósito, senão o próprio login entraria em loop de redirecionamento. Pra
cadastrar um novo admin: inserir direto na tabela `Admin` com o
`supabaseUserId` de um usuário já existente no Supabase Auth (não tem UI pra
isso ainda — só o primeiro admin foi criado assim, via script).

**Loja (`/`, `/produtos/[slug]`, `/times/[slug]`)**: conectada ao banco real (não
usa mais dados fictícios). Cada produto tem página própria com seletor de tamanho
(`components/size-selector.tsx`) mostrando preço e estoque por variante, avaliações
com estrelas restritas a compra verificada (nota + comentário,
`components/review-form.tsx`, `app/produtos/[slug]/actions.ts`) e recomendações
de produtos relacionados
(`lib/products.ts#getRecommendedProducts` — prioriza mesmo time, completa com
mesma categoria). Catálogo da home tem filtro por categoria/time/tipo via query
string (`?categoria=&time=&tipo=`, form GET em `components/product-filters-bar.tsx`)
— os links "Nacional/Internacional/Seleções" do menu, rodapé e da vitrine de
categorias apontam pra esses filtros. Cada time também tem página própria
(`/times/[slug]`) listando seus produtos; o nome do time é link pra lá tanto no
card quanto na página do
produto.

**Login de cliente (`/login`, `/signup`)**: Supabase Auth — e-mail/senha e Google
OAuth. Helpers em `lib/supabase/{client,server,middleware}.ts` (padrão `@supabase/
ssr`), sessão renovada via `src/middleware.ts`. `app/auth/callback/route.ts` troca
o code do OAuth por sessão. Em login/cadastro (e-mail ou Google), o `Customer` do
Prisma é criado/atualizado via upsert por e-mail com `supabaseUserId` preenchido —
liga a conta a pedidos feitos antes como guest, se o e-mail bater. Cadastro por
e-mail pode exigir confirmação por e-mail antes de criar sessão (configuração
padrão do Supabase). Login social exige habilitar o provider em Supabase →
Authentication → Providers → Google (Client ID/Secret do Google Cloud OAuth
consent screen, redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`).
É um sistema **separado** do login do `/admin` (que ainda não existe).

**Área do cliente (`/account`)**: protegida — redireciona pra `/login` se não
autenticado (`lib/current-customer.ts#getCurrentCustomer`, que resolve o
`Customer` do Prisma a partir da sessão Supabase pelo e-mail). Mostra
nome/e-mail/telefone (editável, `components/profile-form.tsx`) e histórico de
pedidos do cliente, com detalhe em `/account/orders/[id]` — sempre confere
`order.customerId === customer.id` antes de mostrar, pra um cliente nunca ver
pedido de outro só adivinhando o ID.

Sem foto de produto real ainda: cards e página do produto usam um placeholder com
gradiente por categoria (`lib/category-visuals.ts`) + iniciais do time
(`lib/format.ts`). Trocar por `<Image>` real quando houver fotos.

**Carrinho e checkout**: carrinho é client-side (`components/cart-provider.tsx`,
persistido em `localStorage`, sem Customer/sessão — compra é sempre "guest
checkout"). `/checkout` coleta dados do cliente + endereço e chama a Server Action
`createOrder` (`checkout/actions.ts`), que:
1. Revalida preço/estoque contra o banco (nunca confia no que o client mandou).
2. Cria Customer (upsert por e-mail) + Address + Order + OrderItems + Payment
   (tudo numa transação), decrementando o estoque das variantes. O decremento
   usa `updateMany` com `stock: { gte: quantity }` no `where` — checagem e
   decremento atômicos, pra dois compradores concorrentes não conseguirem
   ambos levar a última unidade (condição de corrida).
3. Se `MERCADOPAGO_ACCESS_TOKEN` estiver configurado, cria uma *preference* no
   Mercado Pago (Checkout Pro) e redireciona pro checkout hospedado deles: página
   /checkout/sucesso, /checkout/erro ou /checkout/pendente confirma o pagamento
   consultando a API do Mercado Pago diretamente (`lib/order-sync.ts`) — não
   depende só do webhook, porque em dev `localhost` não é alcançável pelo
   Mercado Pago para notificações (`api/webhooks/mercadopago/route.ts` existe
   pra produção). Sem as credenciais, o pedido é criado mas fica pendente com
   um aviso — nada quebra, só não processa o pagamento de fato.

`Payment.method` é opcional no schema: só sabemos Pix/boleto/cartão depois que o
cliente escolhe na página do Mercado Pago.

O webhook (`api/webhooks/mercadopago/route.ts`) confere a assinatura da
notificação (`lib/mercadopago.ts#verifyMercadoPagoSignature`, header
`x-signature`) antes de processar — precisa de `MERCADOPAGO_WEBHOOK_SECRET`
configurado (Mercado Pago → sua aplicação → Webhooks → detalhes); sem essa
variável, a validação é pulada (mesmo padrão de degradação graciosa do resto
da integração).

## Dados de exemplo

`prisma/seed.ts` cadastra 7 times e 10 produtos (com variantes/estoque) pra dar
volume de teste ao catálogo. É idempotente (usa slug pra não duplicar se rodar de
novo). Rodar com `npx tsx prisma/seed.ts` — não usar `prisma db seed` (CLI do
Prisma tem o mesmo problema de rede em ambiente sandboxed descrito acima).

## Variáveis de ambiente

Ver [`.env.example`](.env.example) — copiar para `.env` (nunca commitado) e
preencher: `DATABASE_URL` + `DIRECT_URL` (Supabase Postgres), chaves do Supabase,
Mercado Pago e Resend.

Banco Supabase (projeto `GalaSoccer`, região `sa-east-1`/São Paulo) já provisionado
e com o schema aplicado. As URLs de conexão usam `sslmode=require&uselibpqcompat=true`
— necessário porque o pooler do Supabase apresenta uma cadeia de certificado que o
`pg`/Prisma trata como "self-signed" sob verificação estrita; esse combo mantém a
conexão criptografada sem falhar na validação. Pegar os valores reais em Supabase →
Connect → ORMs → Prisma.

**Nota sobre ambiente de desenvolvimento sandboxed**: o binário do Prisma
(schema-engine, usado por `migrate dev`/`db push`) não conseguiu abrir conexão de
rede neste ambiente sandboxed específico (trava indefinidamente, mesmo com o TCP
abrindo) — mas a lib `pg` usada em runtime conecta normalmente. A migration inicial
foi aplicada manualmente executando o SQL gerado por
`prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script`
direto via `pg`, e registrada em `_prisma_migrations` para manter o histórico do
Prisma consistente. Rodando de uma máquina/CI sem essa restrição de rede,
`prisma migrate dev` deve funcionar normalmente — não é um problema do schema.

## Convenções de código

- TypeScript estrito, sem `any` não justificado.
- Server Components por padrão; `"use client"` só quando necessário (interatividade).
- Mutações via Server Actions, com validação Zod antes de tocar no banco.
- Nomes de arquivo/rotas em inglês; conteúdo voltado ao usuário final (UI, e-mails) em
  português (pt-BR), já que o público é o mercado brasileiro.
- Cores da marca sempre via tokens semânticos (ver "Identidade visual"), nunca
  hardcoded.

## Integrações externas

- **Mercado Pago**: checkout de pagamento (Pix, boleto, cartão). Webhook para
  atualizar status do pedido.
- **Supabase**: banco de dados, auth e storage.
- **Resend**: envio de e-mails transacionais.

## Custos estimados

Dev/MVP: praticamente R$0 (free tiers), só domínio (~R$40–60/ano).
Produção: ~US$45–50/mês fixos (Vercel Pro + Supabase Pro) + taxa por venda do
Mercado Pago (variável, proporcional ao faturamento).

- Vercel: Hobby não pode ser usado comercialmente → Pro US$20/mês.
- Supabase: free tier cobre o início (500MB DB, 1GB storage); Pro US$25/mês quando
  passar do limite.
- Mercado Pago: sem mensalidade, só taxa por transação (cartão ~4,5–5%, Pix ~0,99%,
  boleto ~R$3,49 fixo — confirmar taxas atuais antes de lançar).
- Resend: free tier 3.000 e-mails/mês; a partir de US$20/mês se crescer.
- Domínio: `.com.br` ~R$40/ano.

## Repositório

https://github.com/TechVisionsOficial/GalaSoccer.git

## Não fazer (por enquanto)

- Não implementar app mobile nativo.
- Não integrar com fornecedor/dropshipping — estoque é cadastrado e mantido
  manualmente pelo admin.
- Não implementar suporte multi-idioma/multi-moeda — foco é mercado brasileiro.
