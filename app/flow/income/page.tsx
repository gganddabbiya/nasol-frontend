"use client";

import { useState } from "react";
import { useAnalyzeDocument } from "@/hooks/useAnalyzeDocument";
import StepActions from "@/components/step/StepActions";
import { useRouter } from "next/navigation";

export default function IncomePage() {
    const router = useRouter();
    const { analyzeDocument } = useAnalyzeDocument();

    // manual 입력 필드는 UI만 남기고 기능 없음
    const [fields, setFields] = useState<Record<string, string>>({
        급여: "",
        상여: "",
        식대: "",
    });

    const [file, setFile] = useState<File | null>(null);
    const [inputMethod, setInputMethod] = useState<"upload" | "manual">("upload");

    const updateField = (key: string, value: string) => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    async function handleNext() {
        // manual 입력 기능은 아직 백엔드 API 없음 → 경고로 처리
        if (inputMethod === "manual") {
            alert("직접 입력 분석 기능은 곧 추가될 예정입니다.");
            return;
        }

        if (!file) {
            alert("PDF 파일을 업로드하세요.");
            return;
        }

        await analyzeDocument(file, "income");

        router.push("/flow/expense");
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    소득 자료 입력
                </h2>
                <p className="text-gray-600">
                    소득 관련 PDF를 업로드하거나 직접 입력하세요.
                </p>
            </div>

            {/* 입력 방법 선택 */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setInputMethod("upload")}
                    className={`px-4 py-2 font-medium transition-colors ${
                        inputMethod === "upload"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    PDF 업로드
                </button>

                <button
                    onClick={() => setInputMethod("manual")}
                    className={`px-4 py-2 font-medium transition-colors ${
                        inputMethod === "manual"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    직접 입력
                </button>
            </div>

            {/* PDF 업로드 */}
            {inputMethod === "upload" && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="income-upload"
                    />

                    <label
                        htmlFor="income-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                    >
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>

                        <span className="text-gray-700 font-medium">
                            {file ? file.name : "파일을 선택하거나 드래그하세요"}
                        </span>
                        <span className="text-sm text-gray-500">PDF 파일만 가능</span>
                    </label>
                </div>
            )}

            {/* 직접 입력 화면 */}
            {inputMethod === "manual" && (
                <div className="space-y-4 opacity-50 pointer-events-none">
                    <h3 className="text-lg font-semibold text-gray-900">
                        직접 입력(준비 중)
                    </h3>

                    {Object.keys(fields).map((key) => (
                        <div key={key} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                {key}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={fields[key]}
                                    onChange={(e) => updateField(key, e.target.value)}
                                    placeholder="금액을 입력하세요"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    원
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <StepActions onNext={handleNext} nextLabel="다음" />
        </div>
    );
}
