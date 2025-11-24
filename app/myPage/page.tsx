"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AccountResponse } from "@/types/account";
import Image from "next/image";

export default function MyPage() {
    const [account, setAccount] = useState<AccountResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login");
            return;
        }

        // 먼저 현재 사용자 정보를 가져오는 API를 시도
        // 만약 이 API가 없다면, authentication/status에서 사용자 정보를 가져오거나
        // 다른 방법을 사용해야 할 수 있습니다.
        const fetchAccountInfo = async () => {
            try {
                setLoading(true);
                setError(null);

                // 방법 1: 세션에서 현재 사용자 정보를 가져오는 API 시도
                let response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/account/me`,
                    {
                        credentials: "include",
                    }
                );

                // 404면 다른 방법 시도
                if (response.status === 404) {
                    // 방법 2: authentication/status에서 사용자 정보 가져오기
                    const statusResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/authentication/status`,
                        {
                            credentials: "include",
                        }
                    );
                    const statusData = await statusResponse.json();

                    // status API에서 oauth_type과 oauth_id를 가져올 수 있다면
                    if (statusData.oauth_type && statusData.oauth_id) {
                        response = await fetch(
                            `${process.env.NEXT_PUBLIC_API_BASE_URL}/account/${statusData.oauth_type}/${statusData.oauth_id}`,
                            {
                                credentials: "include",
                            }
                        );
                    } else {
                        throw new Error("사용자 정보를 가져올 수 없습니다.");
                    }
                }

                if (!response.ok) {
                    throw new Error("계정 정보를 가져오는데 실패했습니다.");
                }

                const data: AccountResponse = await response.json();
                setAccount(data);
            } catch (err) {
                console.error("[MyPage] Failed to fetch account:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "계정 정보를 불러오는데 실패했습니다."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAccountInfo();
    }, [isLoggedIn, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-zinc-50 dark:bg-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">로딩 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-zinc-50 dark:bg-black">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="flex justify-center items-center h-screen bg-zinc-50 dark:bg-black">
                <p className="text-zinc-600 dark:text-zinc-400">
                    계정 정보를 찾을 수 없습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
                    {/* 프로필 헤더 */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="relative w-24 h-24 rounded-full bg-white dark:bg-zinc-800 overflow-hidden border-4 border-white dark:border-zinc-700">
                                {account.profile_image ? (
                                    <Image
                                        src={account.profile_image}
                                        alt={account.nickname || account.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {(account.nickname || account.name || "U").charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {account.nickname || account.name}
                                </h1>
                                {account.nickname && account.name && (
                                    <p className="text-blue-100 text-lg">{account.name}</p>
                                )}
                                <p className="text-blue-100 mt-2">{account.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* 계정 정보 */}
                    <div className="px-6 py-6">
                        <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-6">
                            계정 정보
                        </h2>

                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-zinc-200 dark:border-zinc-700 pb-4">
                                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:w-32 mb-1 sm:mb-0">
                                    OAuth 타입
                                </div>
                                <div className="flex-1 text-black dark:text-zinc-50">
                                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                                        {account.oauth_type}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-zinc-200 dark:border-zinc-700 pb-4">
                                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:w-32 mb-1 sm:mb-0">
                                    OAuth ID
                                </div>
                                <div className="flex-1 text-black dark:text-zinc-50 font-mono text-sm">
                                    {account.oauth_id}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-zinc-200 dark:border-zinc-700 pb-4">
                                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:w-32 mb-1 sm:mb-0">
                                    닉네임
                                </div>
                                <div className="flex-1 text-black dark:text-zinc-50">
                                    {account.nickname || "-"}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-zinc-200 dark:border-zinc-700 pb-4">
                                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:w-32 mb-1 sm:mb-0">
                                    이름
                                </div>
                                <div className="flex-1 text-black dark:text-zinc-50">
                                    {account.name || "-"}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-zinc-200 dark:border-zinc-700 pb-4">
                                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:w-32 mb-1 sm:mb-0">
                                    이메일
                                </div>
                                <div className="flex-1 text-black dark:text-zinc-50">
                                    {account.email || "-"}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-zinc-200 dark:border-zinc-700 pb-4">
                                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:w-32 mb-1 sm:mb-0">
                                    전화번호
                                </div>
                                <div className="flex-1 text-black dark:text-zinc-50">
                                    {account.phone_number || "-"}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-zinc-200 dark:border-zinc-700 pb-4">
                                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:w-32 mb-1 sm:mb-0">
                                    상태
                                </div>
                                <div className="flex-1">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                            account.active_status
                                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                        }`}
                                    >
                                        {account.active_status ? "활성" : "비활성"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-zinc-200 dark:border-zinc-700 pb-4">
                                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:w-32 mb-1 sm:mb-0">
                                    역할 ID
                                </div>
                                <div className="flex-1 text-black dark:text-zinc-50">
                                    {account.role_id}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center border-b border-zinc-200 dark:border-zinc-700 pb-4">
                                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:w-32 mb-1 sm:mb-0">
                                    가입일
                                </div>
                                <div className="flex-1 text-black dark:text-zinc-50">
                                    {new Date(account.created_at).toLocaleString("ko-KR")}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center pb-4">
                                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:w-32 mb-1 sm:mb-0">
                                    최종 수정일
                                </div>
                                <div className="flex-1 text-black dark:text-zinc-50">
                                    {new Date(account.updated_at).toLocaleString("ko-KR")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
