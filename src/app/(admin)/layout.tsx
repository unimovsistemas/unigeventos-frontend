import { ReactNode } from "react";
import Link from "next/link";
import {
  Home,
  Calendar,
  Users,
  Settings,
  CreditCard,
  TicketPercent,
  Church,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import WeatherWidget from "@/components/ui/weather-widget";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#1e1e1e] text-neutral-200">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2b2b2b] border-r border-[#333] shadow-sm p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-orange-500 mb-8">
          Painel Admin
        </h2>
        <nav className="space-y-4">
          <NavItem href="/admin/dashboard" icon={<Home size={18} />}>
            Dashboard
          </NavItem>
          <NavItem href="/organizers" icon={<Church size={18} />}>
            Organizadores
          </NavItem>
          <NavItem href="/admin/events" icon={<Calendar size={18} />}>
            Eventos
          </NavItem>
          <NavItem href="/admin/payments" icon={<CreditCard size={18} />}>
            Pagamentos
          </NavItem>
          <NavItem href="/admin/coupons" icon={<TicketPercent size={18} />}>
            Cupons
          </NavItem>
          <NavItem href="/admin/schedulings" icon={<CalendarClock size={18} />}>
            Agendamentos
          </NavItem>
          <NavItem href="/admin/users" icon={<Users size={18} />}>
            Usuários
          </NavItem>
          <NavItem href="/admin/roles" icon={<ShieldCheck size={18} />}>
            Papéis
          </NavItem>
          <NavItem href="/admin/configurations" icon={<Settings size={18} />}>
            Configurações
          </NavItem>
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-[#2b2b2b] px-6 py-4 flex items-center justify-between border-b border-[#333]">
          <WeatherWidget />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full hover:opacity-90 transition">
                <Avatar
                  className="h-9 w-9 border border-neutral-600"
                  src="{user?.imageUrl}"
                  alt="{user?.name}"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-[#2b2b2b] text-neutral-200 border border-[#444]">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#444]" />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">Meu Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/edit-profile">Editar Dados</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#444]" />
              <DropdownMenuItem className="text-red-500 hover:text-red-600">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-6 bg-gradient-to-br from-black via-[#1e1e1e] to-[#2b2b2b]">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 text-neutral-300 hover:text-orange-400 transition-colors font-medium"
    >
      {icon}
      {children}
    </Link>
  );
}
