/**
 * Utilitário profissional para gerenciamento de cookies
 * Suporta tanto desenvolvimento quanto produção
 */

interface CookieOptions {
  path?: string;
  domain?: string;
  maxAge?: number; // em segundos
  expires?: Date;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export class CookieManager {
  private static isProduction = process.env.NODE_ENV === 'production';
  private static isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

  /**
   * Define um cookie com configurações otimizadas para segurança
   */
  static set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === 'undefined') return; // SSR safety

    const defaultOptions: CookieOptions = {
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      sameSite: this.isProduction ? 'Strict' : 'Lax',
      secure: this.isHttps,
      // httpOnly não pode ser definido via JavaScript
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    let cookieString = `${name}=${encodeURIComponent(value)}`;
    
    if (mergedOptions.path) cookieString += `; Path=${mergedOptions.path}`;
    if (mergedOptions.domain) cookieString += `; Domain=${mergedOptions.domain}`;
    if (mergedOptions.maxAge) cookieString += `; Max-Age=${mergedOptions.maxAge}`;
    if (mergedOptions.expires) cookieString += `; Expires=${mergedOptions.expires.toUTCString()}`;
    if (mergedOptions.secure) cookieString += `; Secure`;
    if (mergedOptions.sameSite) cookieString += `; SameSite=${mergedOptions.sameSite}`;

    document.cookie = cookieString;
    
    console.log(`Cookie '${name}' definido com opções:`, mergedOptions);
  }

  /**
   * Obtém o valor de um cookie
   */
  static get(name: string): string | null {
    if (typeof document === 'undefined') return null; // SSR safety

    const matches = document.cookie.match(new RegExp(
      '(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/+^])/g, '\\$1') + '=([^;]*)'
    ));
    
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  /**
   * Remove um cookie
   */
  static remove(name: string, options: Partial<CookieOptions> = {}): void {
    this.set(name, '', {
      ...options,
      maxAge: -1,
      expires: new Date(0)
    });
  }

  /**
   * Verifica se um cookie existe
   */
  static exists(name: string): boolean {
    return this.get(name) !== null;
  }

  /**
   * Define cookies de autenticação com configurações otimizadas
   */
  static setAuthCookies(token: string, roles: string[]): void {
    // Configurações específicas para cookies de autenticação
    const authOptions: CookieOptions = {
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      sameSite: this.isProduction ? 'Strict' : 'Lax',
      secure: this.isHttps,
    };

    this.set('accessToken', token, authOptions);
    this.set('userRoles', JSON.stringify(roles), authOptions);
  }

  /**
   * Remove todos os cookies de autenticação
   */
  static clearAuthCookies(): void {
    this.remove('accessToken');
    this.remove('userRoles');
    this.remove('refreshToken'); // se existir
  }

  /**
   * Obtém informações de autenticação dos cookies
   */
  static getAuthInfo(): { token: string | null; roles: string[] } {
    const token = this.get('accessToken');
    const rolesStr = this.get('userRoles');
    
    let roles: string[] = [];
    if (rolesStr) {
      try {
        roles = JSON.parse(rolesStr);
      } catch (e) {
        console.warn('Erro ao parsear roles do cookie:', e);
      }
    }

    return { token, roles };
  }
}

export default CookieManager;