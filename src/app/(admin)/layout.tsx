"use client";

import { ReactNode, useState } from "react";
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
  Menu,
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

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Controle do estado do menu lateral

  return (
    <div className="min-h-screen flex bg-[#1e1e1e] text-neutral-200">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-[#2b2b2b] border-r border-[#333] shadow-sm p-6 hidden md:block ${
          isSidebarOpen ? "block" : "hidden md:block"
        }`}
      >
        <h2 className="text-2xl font-bold text-orange-500 mb-8">
          Painel Admin
        </h2>
        <nav className="space-y-4">
          <NavItem href="/dashboard" icon={<Home size={18} />}>
            Dashboard
          </NavItem>
          <NavItem href="/organizers" icon={<Church size={18} />}>
            Organizadores
          </NavItem>
          <NavItem href="/events" icon={<Calendar size={18} />}>
            Eventos
          </NavItem>
          <NavItem href="/payments" icon={<CreditCard size={18} />}>
            Pagamentos
          </NavItem>
          <NavItem href="/coupons" icon={<TicketPercent size={18} />}>
            Cupons
          </NavItem>
          <NavItem href="/schedulings" icon={<CalendarClock size={18} />}>
            Agendamentos
          </NavItem>
          <NavItem href="/users" icon={<Users size={18} />}>
            Usuários
          </NavItem>
          <NavItem href="/roles" icon={<ShieldCheck size={18} />}>
            Papéis
          </NavItem>
          <NavItem href="/configurations" icon={<Settings size={18} />}>
            Configurações
          </NavItem>
        </nav>
      </aside>

      {/* Main content */}
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

          {/* Hamburger Menu for Mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="md:hidden text-white"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="ml-2" size={16} /> {/* Ícone de hambúrguer */}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-[#2b2b2b] text-neutral-200 border border-[#444]">
              <DropdownMenuLabel className="font-bold text-orange-500 mb-8">
                Painel Admin
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#444]" />
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/dashboard"
                >
                  {<Home size={14} />} Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/organizers"
                >
                  {<Church size={14} />} Organizadores
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/events"
                >
                  {<Calendar size={14} />} Eventos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/payments"
                >
                  {<CreditCard size={14} />} Pagamentos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/coupons"
                >
                  {<TicketPercent size={14} />} Cupons
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/schedulings"
                >
                  {<CalendarClock size={14} />} Agendamentos
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/users"
                >
                  {<Users size={14} />} Usuários
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/roles"
                >
                  {<ShieldCheck size={14} />} Papéis
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center justify-start gap-2"
                  href="/configurations"
                >
                  {<Settings size={14} />} Configurações
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Area */}
        <main className="flex-1 p-6 bg-gradient-to-br bg-[#2b2b2b] overflow-y-auto h-screen">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
            {children}
          </div>
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
