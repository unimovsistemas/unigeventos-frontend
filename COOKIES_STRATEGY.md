# 🍪 Estratégia Profissional de Cookies - UniEventos

## 📋 **Visão Geral**

Esta implementação utiliza uma **abordagem híbrida** que funciona tanto em desenvolvimento quanto em produção, priorizando segurança sem comprometer funcionalidade.

## 🔒 **Estratégia de Segurança**

### **Produção (Recomendado)**
```typescript
// Backend define cookies HttpOnly + Secure
app.post('/auth/login', (req, res) => {
  const token = generateJWT(user);
  
  res.cookie('accessToken', token, {
    httpOnly: true,    // ✅ Protege contra XSS
    secure: true,      // ✅ Apenas HTTPS
    sameSite: 'strict', // ✅ Protege contra CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  });
  
  res.json({ success: true, roles: user.roles });
});
```

### **Desenvolvimento (Fallback)**
```typescript
// Cliente define cookies seguros
CookieManager.setAuthCookies(token, roles);
// Aplica Secure apenas em HTTPS
// SameSite=Lax para desenvolvimento
```

## 🎯 **Componentes da Solução**

### **1. CookieManager (`/lib/cookieManager.ts`)**
- ✅ Gerenciamento centralizado de cookies
- ✅ Configurações automáticas por ambiente
- ✅ Segurança adaptativa (Secure + SameSite)
- ✅ Encoding/Decoding automático

### **2. AuthService (`/services/authService.ts`)**  
- ✅ Detecção automática de cookies HttpOnly
- ✅ Fallback para desenvolvimento
- ✅ Limpeza completa no logout

### **3. Middleware (`/middleware.ts`)**
- ✅ Validação server-side
- ✅ Controle de acesso por roles
- ✅ Logs apenas em desenvolvimento

### **4. useAuth Hook (`/hooks/useAuth.ts`)**
- ✅ Estado reativo de autenticação
- ✅ Helpers para verificação de roles
- ✅ Logout integrado

## 🚀 **Configuração para Produção**

### **Backend (Node.js/Express)**
```typescript
import cookieParser from 'cookie-parser';

app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL
}));

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await authenticateUser(username, password);
    
    const token = jwt.sign(
      { sub: user.id, email: user.email, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Cookie HttpOnly + Secure
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });
    
    res.cookie('userRoles', JSON.stringify(user.roles), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({ 
      success: true, 
      roles: user.roles 
      // Não enviar token no body em produção
    });
    
  } catch (error) {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Logout endpoint  
app.post('/auth/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('userRoles');
  res.json({ success: true });
});
```

### **Frontend (Next.js)**
```typescript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL}/api/:path*`
      }
    ];
  }
};

// .env.local
BACKEND_URL=https://api.exemplo.com
NODE_ENV=production
```

## 🔧 **Benefícios da Abordagem**

### **Segurança** 
- ✅ **HttpOnly**: Proteção contra XSS em produção
- ✅ **Secure**: Transmissão apenas HTTPS em produção  
- ✅ **SameSite**: Proteção contra CSRF
- ✅ **Middleware**: Validação server-side

### **Desenvolvedor Experience**
- ✅ **Funciona localmente**: Sem configuração adicional
- ✅ **Híbrido**: Detecção automática do ambiente
- ✅ **Centralizado**: CookieManager unificado
- ✅ **TypeScript**: Totalmente tipado

### **Produção Ready**
- ✅ **Zero configuração**: Funciona automaticamente
- ✅ **Performático**: Middleware edge-side
- ✅ **Escalável**: Suporta múltiplos domínios
- ✅ **Observável**: Logs estruturados

## 📊 **Comparação de Abordagens**

| Aspecto | LocalStorage | Cookies Client | **Cookies HttpOnly** |
|---------|--------------|----------------|----------------------|
| Segurança XSS | ❌ Vulnerável | ⚠️ Limitada | ✅ Protegido |
| Segurança CSRF | ✅ Protegido | ⚠️ Configurável | ✅ Protegido |
| SSR/Middleware | ❌ Não acessa | ✅ Acessa | ✅ Acessa |
| Desenvolvimento | ✅ Simples | ✅ Simples | ⚠️ Requer backend |
| Produção | ❌ Não recomendado | ⚠️ Aceitável | ✅ Recomendado |

## 🎯 **Roadmap**

### **Fase 1: Desenvolvimento** ✅
- [x] CookieManager implementado
- [x] Fallback para desenvolvimento
- [x] Middleware funcional
- [x] useAuth hook

### **Fase 2: Produção** 
- [ ] Backend com cookies HttpOnly
- [ ] Testes de segurança
- [ ] Monitoramento de cookies
- [ ] Rate limiting

### **Fase 3: Avançado**
- [ ] Refresh token rotation
- [ ] Multi-domain support  
- [ ] Cookie consent banner
- [ ] Security headers (HSTS, CSP)

## 🔍 **Como Testar**

### **Desenvolvimento**
```bash
# Verificar cookies no DevTools
# Application > Cookies > localhost:3000
# Deve ver: accessToken, userRoles (sem HttpOnly flag)
```

### **Produção**  
```bash
# Verificar cookies no DevTools
# Application > Cookies > seu-dominio.com
# Deve ver: accessToken, userRoles (COM HttpOnly flag)
```

## 📚 **Recursos Adicionais**

- [OWASP Cookie Security](https://owasp.org/www-community/controls/SecureCookieAttribute)
- [MDN HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Next.js Middleware](https://nextjs.org/docs/advanced-features/middleware)

---

*Esta documentação é atualizada conforme evoluções na arquitetura de segurança.*