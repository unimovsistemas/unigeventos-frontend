# Configuração do Cloudflare Turnstile

## O que é o Cloudflare Turnstile?

O Cloudflare Turnstile é uma alternativa moderna e gratuita ao reCAPTCHA do Google. Ele oferece:

- ✅ **Gratuito** para até 1 milhão de verificações por mês
- ✅ **Melhor UX** - menos intrusivo para usuários legítimos
- ✅ **Sem dependência do Google** - maior privacidade
- ✅ **Fácil implementação** - API simples e bem documentada
- ✅ **Proteção eficiente** contra bots e ataques automatizados

## Como configurar

### 1. Criar conta no Cloudflare

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com)
2. Crie uma conta gratuita (se não tiver)
3. Vá para **Turnstile** no menu lateral

### 2. Criar um Site no Turnstile

1. Clique em **"Add site"**
2. Preencha:
   - **Site name**: Nome do seu projeto (ex: "UniGeventos Frontend")
   - **Domain**: Seu domínio (ex: `localhost`, `unigeventos.com`)
   - **Widget mode**: Selecione **"Managed"** (recomendado)
   - **Pre-clearance**: Deixe **"Off"** para início

### 3. Obter as chaves

Após criar o site, você receberá:

- **Site Key** (público): Usado no frontend
- **Secret Key** (privado): Usado no backend para validação

### 4. Configurar no projeto

1. Copie o arquivo `.env.local.example` para `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Edite o arquivo `.env.local` e substitua pelas suas chaves:
```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=sua_site_key_aqui
TURNSTILE_SECRET_KEY=sua_secret_key_aqui
```

⚠️ **IMPORTANTE**: 
- A `NEXT_PUBLIC_TURNSTILE_SITE_KEY` é pública e será incluída no bundle do frontend
- A `TURNSTILE_SECRET_KEY` é privada e deve ser mantida secreta no servidor

### 5. Testar a implementação

1. Reinicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse `/login`
3. Preencha usuário e senha
4. O captcha deve aparecer automaticamente
5. Complete a verificação e teste o login

## Chaves de teste

Para desenvolvimento, você pode usar as chaves de teste do Cloudflare:

- **Site Key**: `1x00000000000000000000AA` (sempre passa)
- **Site Key**: `2x00000000000000000000AB` (sempre falha)
- **Site Key**: `3x00000000000000000000FF` (força interação)

## Funcionalidades implementadas

✅ **Aparição condicional**: Captcha só aparece quando usuário e senha estão preenchidos
✅ **Validação integrada**: Botão só habilita com captcha válido
✅ **Tratamento de erros**: Mensagens de erro específicas
✅ **Layout responsivo**: Funciona em desktop e mobile
✅ **Tema personalizado**: Segue o design do sistema

## Validação no backend

Para validar o token no backend, você pode usar esta função:

```javascript
async function validateTurnstileToken(token) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });

  const data = await response.json();
  return data.success;
}
```

## Próximos passos

1. Configure suas chaves reais do Cloudflare
2. Implemente a validação no backend
3. Configure domínios de produção no dashboard
4. Monitore as métricas de uso no dashboard do Cloudflare

## Suporte

- [Documentação oficial](https://developers.cloudflare.com/turnstile/)
- [Dashboard do Cloudflare](https://dash.cloudflare.com)
- [Exemplos de código](https://github.com/cloudflare/turnstile-demo)