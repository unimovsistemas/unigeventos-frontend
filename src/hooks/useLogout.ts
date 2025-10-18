import { useRouter } from "next/navigation";
import { logout } from "@/services/authService";
import { toast } from "react-toastify";

export const useLogout = () => {
  const router = useRouter();

  const performLogout = async () => {
    try {
      // Buscar refreshToken do localStorage
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (refreshToken) {
        // Chamar endpoint de logout
        await logout(refreshToken);
      }

      // Limpar todos os tokens do localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      // Exibir mensagem de sucesso
      toast.success("Logout realizado com sucesso!");
      
      // Aguardar um momento para o toast aparecer antes de redirecionar
      setTimeout(() => {
        // Redirecionar para a página inicial
        router.push("/");
      }, 1000);

    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      
      // Mesmo com erro na API, limpar tokens localmente
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      // Exibir mensagem de erro mas ainda redirecionar
      toast.error("Erro ao fazer logout, mas você foi desconectado localmente");
      
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  };

  return { performLogout };
};