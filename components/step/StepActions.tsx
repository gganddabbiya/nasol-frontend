"use client";

export default function StepActions({
                                        onPrev,
                                        onNext,
                                        onSkip,
                                        nextLabel = "다음",
                                    }: {
    onPrev?: () => void;
    onNext?: () => void;
    onSkip?: () => void;
    nextLabel?: string;
}) {
    return (
        <div className="flex justify-end gap-3 mt-10">
            {onSkip && (
                <button
                    onClick={onSkip}
                    className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-900"
                >
                    건너뛰기
                </button>
            )}
            {onNext && (
                <button
                    onClick={onNext}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    {nextLabel}
                </button>
            )}
        </div>
    );
}
