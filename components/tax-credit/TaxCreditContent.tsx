import LoadingSpinner from "./LoadingSpinner";
import MarkdownRenderer from "./MarkdownRenderer";

interface TaxCreditContentProps {
    loading: boolean;
    error: string | null;
    result: string | null;
    activeTab: "detail" | "checklist";
}

export default function TaxCreditContent({ loading, error, result, activeTab }: TaxCreditContentProps) {
    return (
        <div className="px-6 py-8 min-h-[300px]">
            {loading && <LoadingSpinner activeTab={activeTab} />}

            {!loading && error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {!loading && !error && result && typeof result === 'string' && (
                <MarkdownRenderer content={result} />
            )}

            {!loading && !error && !result && (
                <div className="text-center py-10 text-zinc-500 dark:text-zinc-400">
                    분석 결과가 없습니다.
                </div>
            )}
        </div>
    );
}