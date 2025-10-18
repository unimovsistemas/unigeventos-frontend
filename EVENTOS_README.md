# Eventos Públicos - UniEventos Frontend

## 📋 Visão Geral
Sistema de visualização de eventos públicos totalmente desacoplado do layout principal, oferecendo uma experiência limpa e moderna para visitantes conhecerem e se inscreverem em eventos.

## 🏗️ Estrutura da Aplicação

### Rotas Implementadas
```
/eventos                    - Lista de eventos públicos
/eventos/[id]              - Detalhes do evento específico
```

### Arquitetura de Componentes
```
src/
├── app/
│   └── eventos/           - Rota independente (fora do grupo (public))
│       ├── layout.tsx     - Layout limpo com header/footer dedicado
│       ├── page.tsx       - Lista de eventos com busca e paginação
│       └── [id]/
│           └── page.tsx   - Página de detalhes do evento
├── components/
│   ├── public/
│   │   └── EventCard.tsx  - Card individual do evento
│   └── ui/
│       └── badge.tsx      - Componente de badge para categorias
└── services/
    └── publicEventsService.ts - Integração com API pública
```

## 🎨 Design System

### Tema e Cores
- **Primário**: Laranja (#ea580c) - Botões principais, links e destaques
- **Secundário**: Cinza (#6b7280) - Textos secundários e bordas  
- **Sucesso**: Verde (#16a34a) - Eventos gratuitos e confirmações
- **Informação**: Roxo (#7c3aed) - Badges e informações adicionais
- **Erro**: Vermelho (#dc2626) - Alertas e ações destrutivas

### Tipografia
- **Headers**: `font-bold` com escalas responsivas (3xl-5xl)
- **Body**: `font-medium` para textos de ação, `font-normal` para conteúdo
- **Detalhes**: `text-sm` para metadados e informações secundárias

## 🔧 Funcionalidades

### Lista de Eventos (/eventos)
- ✅ Hero section com busca integrada
- ✅ Estatísticas dinâmicas (total, pagos, gratuitos)
- ✅ Grid responsivo de eventos (1-2-3 colunas)
- ✅ Busca por nome e descrição
- ✅ Paginação com controles
- ✅ Estados de loading, erro e vazio
- ✅ Mock data para demonstração quando API indisponível

### Detalhes do Evento (/eventos/[id])
- ✅ Layout em 2 colunas (detalhes + inscrição)
- ✅ Informações completas do evento
- ✅ Badges para categorização visual
- ✅ Status de inscrições em tempo real
- ✅ Informações de preços e lotes
- ✅ Mapa de localização (endereço completo)
- ✅ Indicadores de transporte e termos
- ✅ Botão de inscrição com validações

### EventCard Component
- ✅ Design clean com hover effects
- ✅ Badges para tipo de evento e extras
- ✅ Informações de preço (menor valor ou gratuito)
- ✅ Metadados organizados (data, local, participantes)
- ✅ Botões "Saber Mais" e "Inscrever-se"
- ✅ Estados desabilitados para eventos lotados/fechados

## 🌐 Integração de API

### Endpoint Principal
```typescript
GET localhost:8001/events/queries/published-events
```

### Tratamento de Dados
- **API disponível**: Busca e filtragem pelos dados reais
- **API indisponível**: Fallback para mock data demonstrativo
- **Validações**: Verificação de status de inscrição e disponibilidade

### Mock Data
Sistema de fallback com 3 eventos exemplo:
1. **Conferência de Jovens 2025** - Evento pago com múltiplos lotes
2. **Retiro de Casais** - Evento premium com termos obrigatórios
3. **Seminário de Liderança** - Evento gratuito de capacitação

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 640px (1 coluna, botões empilhados)
- **Tablet**: 640px-1024px (2 colunas de eventos)
- **Desktop**: > 1024px (3 colunas + layout completo)

### Mobile-First Approach
- ✅ **Cards otimizados** - Touch-friendly com botões grandes
- ✅ **Navegação simplificada** - Menu colapsado em mobile
- ✅ **Informações hierarquizadas** - Prioridade mobile-first
- ✅ **Botões responsivos** - Área de toque adequada (44px+)
- ✅ **Textos escaláveis** - Typography responsive (xs→sm→base→lg)
- ✅ **Espaçamentos adaptáveis** - Padding/margin menores em mobile
- ✅ **Grid flex** - 1 coluna mobile → 2 tablet → 3 desktop
- ✅ **Hero compacto** - Altura reduzida em telas pequenas

## 🚀 Estados da Aplicação

### Loading States
- Spinner centralizado com texto explicativo
- Skeleton loading para melhores transições
- Feedback visual durante operações

### Error States
- Mensagens amigáveis de erro
- Botões de retry para recuperação
- Fallback para mock data quando aplicável

### Empty States
- Ilustrações explicativas
- Mensagens contextuais
- Ações de recuperação (limpar busca)

## 🔄 Fluxo de Usuário

### Visitante Anônimo
1. Acessa `/eventos`
2. Navega pela lista ou busca eventos
3. Clica em "Saber Mais" para ver detalhes
4. Clica em "Inscrever-se" → Redirecionado para login
5. Após login → Redirecionado para formulário de inscrição

### Navegação Interna
- Header com logo e navegação
- Breadcrumbs implícitos (botão voltar)
- Links contextuais entre páginas
- Footer com informações institucionais

## 🎯 Próximos Passos

### Melhorias Planejadas
- [ ] Filtros avançados (tipo, preço, data)
- [ ] Ordenação personalizada
- [ ] Compartilhamento social
- [ ] Favoritos (após login)
- [ ] Notificações de abertura de inscrições
- [ ] Integração com calendário

### Otimizações Técnicas
- [ ] Lazy loading de imagens
- [ ] Cache de requisições
- [ ] Pré-carregamento de rotas
- [ ] Compressão de assets
- [ ] SEO metadata dinâmico

## 🛠️ Dependências Principais

```json
{
  "next": "15.2.4",
  "react": "^19.0.0",
  "tailwindcss": "^3.x",
  "lucide-react": "^0.487.0",
  "class-variance-authority": "^0.7.1"
}
```

## 📝 Notas de Implementação

### Decisões Arquiteturais
- **Rota independente**: `/eventos` fora do grupo `(public)` para evitar conflitos
- **Layout dedicado**: Header/footer próprios para máxima flexibilidade
- **Componentização**: EventCard reutilizável com props bem definidas
- **Type safety**: Interfaces TypeScript para todos os dados

### Padrões de Código
- **Hooks organizados**: useState/useEffect no topo dos componentes
- **Formatação consistente**: Intl.DateTimeFormat para datas/valores
- **Error boundaries**: Tratamento gracioso de erros
- **Acessibilidade**: ARIA labels e navegação por teclado

---

*Documentação atualizada em: Janeiro 2025*