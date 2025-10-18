# Tela de Configurações - Documentação

## 📋 Visão Geral

Sistema de configurações genérico e extensível que permite diferentes visualizações baseadas no perfil do usuário (Admin ou Usuário Comum).

## 🏗️ Estrutura de Arquivos

```
src/
├── components/
│   ├── settings/
│   │   ├── ConfigurationLayout.tsx      # Layout genérico reutilizável
│   │   └── PasswordResetSection.tsx     # Componente de alteração de senha
│   └── ui/
│       ├── tabs.tsx                     # Componente de navegação por abas
│       └── card.tsx                     # Componente de card (atualizado)
├── services/
│   └── settingsService.ts               # Serviço para gerenciar configurações
└── app/
    └── (admin)/
        └── configurations/
            ├── page.tsx                 # Página de configurações do admin
            └── user-example.tsx         # Exemplo para implementação futura
```

## 🎨 Temas Suportados

### Tema Dark (Admin)
- Fundo: `#1e1e1e` e `#2b2b2b`
- Bordas: `#333` e `#444`
- Texto: `neutral-200` e `neutral-400`
- Destaque: `orange-500`

### Tema Light (Usuário Comum - Futuro)
- Fundo: `white` e `gray-50`
- Bordas: `gray-200` e `gray-300`
- Texto: `gray-900` e `gray-600`
- Destaque: `orange-500`

## 🔧 Componentes

### 1. ConfigurationLayout

Componente genérico que gerencia a estrutura de abas e permite configurações específicas por perfil.

**Props:**
```typescript
interface ConfigurationLayoutProps {
  tabs: ConfigurationTab[];         // Array de abas
  defaultTab?: string;              // Aba padrão ao carregar
  theme?: "dark" | "light";         // Tema visual
  userRole?: "admin" | "user";      // Perfil do usuário
  title?: string;                   // Título da página
  description?: string;             // Descrição da página
}
```

**Exemplo de uso:**
```tsx
<ConfigurationLayout
  tabs={configurationTabs}
  defaultTab="password"
  theme="dark"
  userRole="admin"
  title="Configurações do Administrador"
  description="Gerencie suas configurações pessoais e do sistema"
/>
```

### 2. PasswordResetSection

Componente para alteração de senha com validação de segurança.

**Props:**
```typescript
interface PasswordResetSectionProps {
  theme?: "dark" | "light";         // Tema visual
  onSuccess?: () => void;           // Callback em caso de sucesso
  onError?: (error: string) => void; // Callback em caso de erro
}
```

**Validações implementadas:**
- Senha atual obrigatória
- Nova senha diferente da atual
- Confirmação de senha
- Mínimo 8 caracteres
- Pelo menos uma letra maiúscula
- Pelo menos uma letra minúscula
- Pelo menos um número

### 3. Tabs Component

Sistema de abas reutilizável e acessível.

**Componentes:**
- `Tabs`: Container principal
- `TabsList`: Lista de abas
- `TabsTrigger`: Botão de aba individual
- `TabsContent`: Conteúdo de cada aba

## 📊 Estrutura de Abas

Cada aba é definida pela interface:

```typescript
interface ConfigurationTab {
  id: string;              // Identificador único
  label: string;           // Texto exibido
  icon?: ReactNode;        // Ícone opcional
  content: ReactNode;      // Conteúdo da aba
  adminOnly?: boolean;     // Visível apenas para admin
  userOnly?: boolean;      // Visível apenas para usuário comum
}
```

## 🔐 Segurança

### Autenticação
- Token JWT armazenado em `localStorage` com chave `accessToken`
- Todas as requisições de mudança de senha requerem autenticação

### Validação de Senha
Implementada no serviço `settingsService.ts`:
- Função `validatePassword()` com regras configuráveis
- Mensagens de erro descritivas

## 🚀 Implementação Futura: Usuário Comum

Para criar a tela de configurações para usuário comum:

### Passo 1: Criar a estrutura de rotas

```bash
mkdir -p src/app/(user)/configurations
```

### Passo 2: Criar o layout (user)

```tsx
// src/app/(user)/layout.tsx
export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar do usuário */}
      <main>{children}</main>
    </div>
  );
}
```

### Passo 3: Criar a página de configurações

Use o arquivo `user-example.tsx` como base. Copie para:
```
src/app/(user)/configurations/page.tsx
```

### Passo 4: Ajustar o tema

O componente já suporta `theme="light"` e `userRole="user"`.

## 🎯 Abas Implementadas

### Admin (Atual)
1. **Senha** - Alteração de senha (✅ Implementado)
2. **Notificações** - Preferências de notificações (🚧 Placeholder)
3. **Segurança** - Configurações avançadas (🚧 Placeholder)
4. **Sistema** - Configurações do sistema (🚧 Placeholder, admin-only)

### Usuário Comum (Futuro)
1. **Perfil** - Dados pessoais (🚧 A implementar)
2. **Senha** - Alteração de senha (✅ Pronto para uso)
3. **Notificações** - Preferências (🚧 A implementar)

## 🔌 Integração com Backend

### Endpoint de mudança de senha

**URL:** `POST /rest/v1/auth/change-password`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "currentPassword": "senhaAtual123",
  "newPassword": "novaSenha456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Senha atual incorreta"
}
```

## 🎨 Customização

### Adicionar nova aba

```tsx
const newTab: ConfigurationTab = {
  id: "minha-nova-aba",
  label: "Minha Nova Aba",
  icon: <IconeComponente size={16} />,
  content: <MeuComponente />,
  adminOnly: false, // ou true para admin only
};

// Adicionar ao array de tabs
const tabs = [...existingTabs, newTab];
```

### Criar seção customizada

```tsx
const MinhaSecao = () => (
  <Card className="bg-[#2b2b2b] border-[#444] text-neutral-200">
    <CardHeader>
      <CardTitle>Título da Seção</CardTitle>
      <CardDescription>Descrição da seção</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Seu conteúdo aqui */}
    </CardContent>
  </Card>
);
```

## 📝 Boas Práticas

1. **Sempre use o tema correto** para cada contexto (dark para admin, light para user)
2. **Marque abas específicas** com `adminOnly` ou `userOnly`
3. **Valide permissões no backend** além do frontend
4. **Use callbacks** `onSuccess` e `onError` para feedback ao usuário
5. **Mantenha consistência visual** usando os componentes base

## 🐛 Troubleshooting

### Erro: "Usuário não autenticado"
- Verifique se o token está armazenado em `localStorage`
- Confirme que a chave é `accessToken`

### Abas não aparecem
- Verifique as propriedades `adminOnly` e `userOnly`
- Confirme que `userRole` está correto no `ConfigurationLayout`

### Tema não aplica corretamente
- Certifique-se de passar `theme="dark"` ou `theme="light"`
- Verifique se os componentes filhos respeitam a prop `theme`

## 📚 Referências

- **Lucide Icons:** https://lucide.dev/
- **Tailwind CSS:** https://tailwindcss.com/
- **Next.js:** https://nextjs.org/

## ✅ Checklist de Implementação

- [x] Componente ConfigurationLayout
- [x] Componente PasswordResetSection
- [x] Componente Tabs
- [x] Serviço settingsService
- [x] Página de configurações do Admin
- [x] Suporte a tema dark
- [x] Validação de senha
- [ ] Implementação para usuário comum
- [ ] Suporte a tema light completo
- [ ] Seção de notificações
- [ ] Seção de segurança
- [ ] Seção de perfil de usuário

---

**Última atualização:** Implementação inicial - Admin Dark Theme
