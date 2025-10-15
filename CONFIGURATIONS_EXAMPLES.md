# Exemplos de Uso - Tela de Configurações

## 🎯 Exemplo 1: Adicionar nova aba de configuração (Admin)

```tsx
// src/app/(admin)/configurations/page.tsx

import { Database } from "lucide-react";

// 1. Criar o componente da seção
const DatabaseSection = () => (
  <Card className="bg-[#2b2b2b] border-[#444] text-neutral-200">
    <CardHeader>
      <CardTitle className="text-xl">Configurações de Banco de Dados</CardTitle>
      <CardDescription className="text-neutral-400">
        Gerencie backups e configurações do banco
      </CardDescription>
    </CardHeader>
    <CardContent>
      {/* Seu conteúdo customizado aqui */}
      <div className="space-y-4">
        <Button className="w-full bg-orange-500">
          Criar Backup Manual
        </Button>
      </div>
    </CardContent>
  </Card>
);

// 2. Adicionar ao array de tabs
const configurationTabs: ConfigurationTab[] = [
  // ... tabs existentes
  {
    id: "database",
    label: "Banco de Dados",
    icon: <Database size={16} />,
    content: <DatabaseSection />,
    adminOnly: true, // Apenas admin pode ver
  },
];
```

## 🎯 Exemplo 2: Criar tela de configurações para usuário comum

```tsx
// src/app/(user)/configurations/page.tsx

"use client";

import { User, Lock, Bell, Heart } from "lucide-react";
import ConfigurationLayout, { ConfigurationTab } from "@/components/settings/ConfigurationLayout";
import PasswordResetSection from "@/components/settings/PasswordResetSection";

export default function UserConfigurationsPage() {
  // Seção de Perfil
  const ProfileSection = () => (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle>Meu Perfil</CardTitle>
        <CardDescription>Atualize suas informações pessoais</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label>Nome Completo</Label>
            <Input placeholder="Seu nome" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="seu@email.com" />
          </div>
          <Button className="bg-orange-500">Salvar Alterações</Button>
        </form>
      </CardContent>
    </Card>
  );

  // Seção de Preferências
  const PreferencesSection = () => (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle>Preferências</CardTitle>
        <CardDescription>Configure suas preferências pessoais</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Receber emails de eventos</Label>
            <input type="checkbox" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Notificações push</Label>
            <input type="checkbox" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const tabs: ConfigurationTab[] = [
    {
      id: "profile",
      label: "Perfil",
      icon: <User size={16} />,
      content: <ProfileSection />,
    },
    {
      id: "password",
      label: "Senha",
      icon: <Lock size={16} />,
      content: <PasswordResetSection theme="light" />,
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: <Bell size={16} />,
      content: <PreferencesSection />,
    },
  ];

  return (
    <ConfigurationLayout
      tabs={tabs}
      defaultTab="profile"
      theme="light"
      userRole="user"
      title="Minhas Configurações"
      description="Gerencie suas preferências e informações"
    />
  );
}
```

## 🎯 Exemplo 3: Usar PasswordResetSection standalone

```tsx
// Em qualquer componente ou página

import PasswordResetSection from "@/components/settings/PasswordResetSection";

export default function MyPage() {
  const handleSuccess = () => {
    console.log("Senha alterada com sucesso!");
    // Redirecionar ou mostrar mensagem
  };

  const handleError = (error: string) => {
    console.error("Erro:", error);
    // Tratar erro customizado
  };

  return (
    <div>
      <h1>Alterar minha senha</h1>
      <PasswordResetSection 
        theme="dark"
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}
```

## 🎯 Exemplo 4: Criar seção com formulário customizado

```tsx
// Nova seção de notificações por email

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EmailNotificationsSection = ({ theme = "dark" }) => {
  const [settings, setSettings] = useState({
    newEvents: true,
    eventReminders: true,
    weeklyDigest: false,
    promotions: false,
  });

  const isDark = theme === "dark";
  const cardClass = isDark 
    ? "bg-[#2b2b2b] border-[#444] text-neutral-200"
    : "bg-white border-gray-200";

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    // Salvar configurações
    console.log("Salvando:", settings);
  };

  return (
    <Card className={cardClass}>
      <CardHeader>
        <CardTitle>Notificações por Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Novos eventos disponíveis</Label>
          <input 
            type="checkbox"
            checked={settings.newEvents}
            onChange={() => handleToggle('newEvents')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label>Lembretes de eventos</Label>
          <input 
            type="checkbox"
            checked={settings.eventReminders}
            onChange={() => handleToggle('eventReminders')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label>Resumo semanal</Label>
          <input 
            type="checkbox"
            checked={settings.weeklyDigest}
            onChange={() => handleToggle('weeklyDigest')}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label>Promoções e ofertas</Label>
          <input 
            type="checkbox"
            checked={settings.promotions}
            onChange={() => handleToggle('promotions')}
          />
        </div>

        <Button 
          onClick={handleSave}
          className="w-full bg-orange-500"
        >
          Salvar Preferências
        </Button>
      </CardContent>
    </Card>
  );
};
```

## 🎯 Exemplo 5: Tabs condicionais baseadas em permissão

```tsx
// Mostrar diferentes tabs baseado em permissões do usuário

const getUserTabs = (userPermissions: string[]): ConfigurationTab[] => {
  const baseTabs: ConfigurationTab[] = [
    {
      id: "password",
      label: "Senha",
      icon: <Lock size={16} />,
      content: <PasswordResetSection theme="dark" />,
    },
  ];

  // Adicionar tab de usuários apenas se tiver permissão
  if (userPermissions.includes('manage_users')) {
    baseTabs.push({
      id: "users",
      label: "Gerenciar Usuários",
      icon: <Users size={16} />,
      content: <UsersManagementSection />,
      adminOnly: true,
    });
  }

  // Adicionar tab de relatórios apenas se tiver permissão
  if (userPermissions.includes('view_reports')) {
    baseTabs.push({
      id: "reports",
      label: "Relatórios",
      icon: <BarChart size={16} />,
      content: <ReportsSection />,
    });
  }

  return baseTabs;
};

export default function ConfigurationsPage() {
  const userPermissions = ['manage_users', 'view_reports']; // Vem do backend

  return (
    <ConfigurationLayout
      tabs={getUserTabs(userPermissions)}
      defaultTab="password"
      theme="dark"
      userRole="admin"
    />
  );
}
```

## 🎯 Exemplo 6: Integração com Context API

```tsx
// Usar configurações globais com Context

// 1. Criar Context
// src/contexts/SettingsContext.tsx
import { createContext, useContext, useState } from 'react';

interface SettingsContextType {
  theme: 'dark' | 'light';
  userRole: 'admin' | 'user';
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [userRole] = useState<'admin' | 'user'>('admin');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <SettingsContext.Provider value={{ theme, userRole, toggleTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

// 2. Usar no componente
import { useSettings } from '@/contexts/SettingsContext';

export default function ConfigurationsPage() {
  const { theme, userRole } = useSettings();

  return (
    <ConfigurationLayout
      tabs={configurationTabs}
      theme={theme}
      userRole={userRole}
    />
  );
}
```

## 🎯 Exemplo 7: Validação customizada de senha

```tsx
// Adicionar validações customizadas

import { validatePassword } from '@/services/settingsService';

// Validação adicional: senha não pode conter nome do usuário
const customValidatePassword = (password: string, username: string) => {
  // Validação base
  const baseValidation = validatePassword(password);
  if (!baseValidation.isValid) {
    return baseValidation;
  }

  // Validação customizada
  if (password.toLowerCase().includes(username.toLowerCase())) {
    return {
      isValid: false,
      message: "A senha não pode conter seu nome de usuário"
    };
  }

  // Verificar sequências comuns
  const commonSequences = ['12345', 'abcde', 'qwerty'];
  if (commonSequences.some(seq => password.toLowerCase().includes(seq))) {
    return {
      isValid: false,
      message: "A senha não pode conter sequências comuns"
    };
  }

  return { isValid: true };
};

// Usar no componente
const handleSubmit = async () => {
  const validation = customValidatePassword(newPassword, currentUser.username);
  if (!validation.isValid) {
    setError(validation.message);
    return;
  }
  // Continuar com mudança de senha...
};
```

## 🎯 Exemplo 8: Loading state e feedback visual

```tsx
// Melhorar feedback visual durante ações

const EnhancedPasswordResetSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async () => {
    setIsLoading(true);
    setProgress(0);

    try {
      // Simular progresso
      setProgress(25);
      await validatePasswordStrength();
      
      setProgress(50);
      await changePassword(payload);
      
      setProgress(75);
      await logPasswordChange();
      
      setProgress(100);
      showSuccessMessage();
      
    } catch (error) {
      showErrorMessage(error);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <Card>
      <CardContent>
        {/* Formulário */}
        
        {isLoading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-center mt-2">
              {progress}% concluído
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

## 🎯 Exemplo 9: Persistir preferências no localStorage

```tsx
// Salvar e recuperar preferências do usuário

const usePersistedSettings = (key: string, defaultValue: any) => {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

// Usar no componente
const NotificationsSection = () => {
  const [emailNotifications, setEmailNotifications] = usePersistedSettings(
    'emailNotifications',
    { events: true, reminders: true }
  );

  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          <label>
            <input
              type="checkbox"
              checked={emailNotifications.events}
              onChange={(e) => setEmailNotifications({
                ...emailNotifications,
                events: e.target.checked
              })}
            />
            Notificar sobre novos eventos
          </label>
        </div>
      </CardContent>
    </Card>
  );
};
```

## 🎯 Exemplo 10: Componente com preview em tempo real

```tsx
// Seção de temas com preview

const ThemeSection = () => {
  const [selectedTheme, setSelectedTheme] = useState('dark');

  const themes = {
    dark: {
      background: '#1e1e1e',
      text: '#e5e5e5',
      primary: '#f97316',
    },
    light: {
      background: '#ffffff',
      text: '#171717',
      primary: '#f97316',
    },
    blue: {
      background: '#1e3a8a',
      text: '#e0f2fe',
      primary: '#60a5fa',
    },
  };

  return (
    <Card className="bg-[#2b2b2b] border-[#444]">
      <CardHeader>
        <CardTitle>Personalizar Tema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Seletor de temas */}
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(themes).map(([name, colors]) => (
              <button
                key={name}
                onClick={() => setSelectedTheme(name)}
                className={`p-4 rounded border-2 ${
                  selectedTheme === name 
                    ? 'border-orange-500' 
                    : 'border-transparent'
                }`}
                style={{ 
                  backgroundColor: colors.background,
                  color: colors.text 
                }}
              >
                <div className="text-sm font-medium">{name}</div>
                <div 
                  className="w-full h-2 mt-2 rounded"
                  style={{ backgroundColor: colors.primary }}
                />
              </button>
            ))}
          </div>

          {/* Preview */}
          <div 
            className="p-6 rounded-lg"
            style={{ 
              backgroundColor: themes[selectedTheme].background,
              color: themes[selectedTheme].text 
            }}
          >
            <h3 className="font-bold mb-2">Preview</h3>
            <p className="text-sm">
              Este é um exemplo de como o tema ficará.
            </p>
            <button
              className="mt-4 px-4 py-2 rounded"
              style={{ 
                backgroundColor: themes[selectedTheme].primary,
                color: '#fff'
              }}
            >
              Botão de Exemplo
            </button>
          </div>

          <Button className="w-full bg-orange-500">
            Aplicar Tema
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 📝 Notas Importantes

1. **Validação no Backend**: Sempre valide dados sensíveis no backend, mesmo que já validados no frontend
2. **Tokens**: Certifique-se de que o token JWT está válido antes de fazer requisições
3. **Feedback Visual**: Sempre forneça feedback claro ao usuário sobre o sucesso ou falha de ações
4. **Acessibilidade**: Use labels, aria-labels e navegação por teclado apropriadamente
5. **Performance**: Use lazy loading para seções pesadas que não são vistas imediatamente

## 🔗 Recursos Adicionais

- [React Hook Form](https://react-hook-form.com/) - Para formulários complexos
- [Zod](https://zod.dev/) - Para validação de schemas
- [React Query](https://tanstack.com/query) - Para gerenciamento de estado assíncrono
- [Framer Motion](https://www.framer.com/motion/) - Para animações suaves

---

**Última atualização:** Exemplos práticos de implementação
