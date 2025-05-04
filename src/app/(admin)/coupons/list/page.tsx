/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, ArrowRightCircle, ArrowLeftCircle, Plus } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import { getAllPage } from "@/services/couponsService";

interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  expirationDate: Date;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export default function CouponListPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoupons() {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Token de acesso não encontrado.");
          return;
        }

        const response: PageResponse<Coupon> = await getAllPage(token, currentPage);
        setCoupons(response.content || []);
        setTotalPages(response.totalPages);
      } catch (error: any) {
        toast.error(error.message || "Erro ao buscar cupons.");
      } finally {
        setLoading(false);
      }
    }

    fetchCoupons();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const renderSkeleton = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <Card
        key={index}
        className="p-4 bg-neutral-900 border border-neutral-700"
      >
        <Skeleton height={24} width="50%" />
        <Skeleton height={18} className="mt-2" />
        <Skeleton height={18} className="mt-2" />
        <Skeleton height={36} className="mt-4" />
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-400">Cupons de Desconto</h1>
        <Link href="/coupons/create">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md shadow flex items-center">
            Novo Cupom <Plus className="ml-2" size={16} />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? renderSkeleton()
          : coupons.map((coupon) => (
              <Card
                key={coupon.id}
                className="p-4 bg-gradient-to-br from-[#222222] via-[#2b2b2b] to-[#1e1e1e] text-white border border-neutral-700 shadow-md"
              >
                <h2 className="text-xl font-semibold text-orange-300">
                  {coupon.code}
                </h2>
                <p className="text-sm text-neutral-300 mt-2">
                  Desconto: <strong>{coupon.discountPercentage}%</strong>
                </p>
                <p className="text-sm text-neutral-400">
                  Expira em:{" "}
                  <strong>{new Date(coupon.expirationDate).toLocaleDateString()}</strong>
                </p>
                <Link href={`/coupons/${coupon.id}/edit`}>
                  <Button
                    className="mt-4 text-orange-400 hover:text-orange-500 border-orange-600"
                  >
                    <Pencil size={16} className="mr-1" />
                    Editar
                  </Button>
                </Link>
              </Card>
            ))}
      </div>

      {!loading && (
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`mt-4 ${
              currentPage === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-orange-400 hover:text-orange-500 cursor-pointer"
            }`}
          >
            Anterior
            <ArrowLeftCircle className="ml-2" size={16} />
          </Button>

          <span className="text-white text-sm">
            Página <strong>{currentPage + 1}</strong> de <strong>{totalPages}</strong>
          </span>

          <Button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className={`mt-4 ${
              currentPage >= totalPages - 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-orange-400 hover:text-orange-500 cursor-pointer"
            }`}
          >
            Próxima
            <ArrowRightCircle className="ml-2" size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}