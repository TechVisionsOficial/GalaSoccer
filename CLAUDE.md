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
    admin/        # painel administrativo (placeholder por enquanto)
    page.tsx      # home da loja
  components/     # componentes de UI compartilhados
  lib/            # clients e utilitários (ex: prisma.ts)
  generated/      # código gerado (Prisma Client) — gitignored
prisma/
  schema.prisma   # modelo de dados
```

## Variáveis de ambiente

Ver [`.env.example`](.env.example) — copiar para `.env` (nunca commitado) e
preencher: `DATABASE_URL` (Supabase Postgres), chaves do Supabase, Mercado Pago
e Resend.

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
