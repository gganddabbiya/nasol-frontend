"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { isLoggedIn, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* 로고 */}
                    <div className="flex-shrink-0">
                        <Link 
                            href="/" 
                            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-200"
                        >
                            MyApp
                        </Link>
                    </div>

                    {/* 네비게이션 링크 */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link 
                            href="/" 
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/50 hover:bg-blue-600 hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                            🏠 Home
                        </Link>

                        <Link 
                            href="/flow" 
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/50 hover:bg-blue-600 hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                            📤 Upload
                        </Link>

                        <Link 
                            href="/assets_simulation" 
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/50 hover:bg-purple-600 hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                            💰 미래 자산 예측
                        </Link>

                        <Link 
                            href="/tax_credit" 
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/50 hover:bg-green-600 hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                            📋 세액 공제 확인
                        </Link>

                        <Link 
                            href="/myPage" 
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/50 hover:bg-indigo-600 hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                            👤 MyPage
                        </Link>
                    </div>

                    {/* 인증 버튼 */}
                    <div className="flex items-center space-x-2">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                🚪 Logout
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                🔐 Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* 모바일 메뉴 */}
                <div className="md:hidden pb-4 space-y-2">
                    <Link 
                        href="/" 
                        className="block px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/50 hover:bg-blue-600 transition-all duration-200"
                    >
                        🏠 Home
                    </Link>
                    <Link 
                        href="/flow" 
                        className="block px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/50 hover:bg-blue-600 transition-all duration-200"
                    >
                        📤 Upload
                    </Link>
                    <Link 
                        href="/assets_simulation" 
                        className="block px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/50 hover:bg-purple-600 transition-all duration-200"
                    >
                        💰 미래 자산 예측
                    </Link>
                    <Link 
                        href="/tax_credit" 
                        className="block px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/50 hover:bg-green-600 transition-all duration-200"
                    >
                        📋 세액 공제 확인
                    </Link>
                    <Link 
                        href="/myPage" 
                        className="block px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/50 hover:bg-indigo-600 transition-all duration-200"
                    >
                        👤 MyPage
                    </Link>
                </div>
            </div>
        </nav>
    );
}
