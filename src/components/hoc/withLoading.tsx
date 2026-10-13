import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@heroui/react';
import { Loader2 } from 'lucide-react';

/**
 * ============================================================================
 * BUỔI 2: REACT DESIGN PATTERN - HIGHER-ORDER COMPONENT (HOC)
 * Pattern bọc component xử lý trạng thái đang tải (Loading Skeleton)
 * Đen trắng tối giản chuẩn HeroUI, sửa dứt điểm lỗi các khối skeleton bị dính nhau
 * ============================================================================
 */

export interface WithLoadingProps {
  isLoading: boolean;
  loadingMessage?: string;
}

export function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P & WithLoadingProps> {
  const ComponentWithLoading: React.FC<P & WithLoadingProps> = ({
    isLoading,
    loadingMessage = 'Đang tải danh sách bài tập...',
    ...props
  }) => {
    if (isLoading) {
      return (
        <div className="w-full space-y-6">
          <div className="flex items-center justify-center gap-2.5 py-4 text-zinc-700 bg-zinc-50 rounded-xl border border-zinc-200">
            <Loader2 className="w-4 h-4 animate-spin text-zinc-800" />
            <span className="text-xs sm:text-sm font-medium">{loadingMessage}</span>
          </div>

          {/* Skeletons mô phỏng danh sách thẻ - Phân tách 2 bên rõ ràng, không dính nhau */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((key) => (
              <Card
                key={key}
                className="w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs animate-pulse flex flex-col justify-between"
              >
                {/* Header: Hai pill nằm tách biệt 2 bên (trái và phải) */}
                <CardHeader className="p-0 pb-3 border-b border-zinc-100 w-full block">
                  <div className="flex items-center justify-between w-full">
                    <div className="h-5 w-24 bg-zinc-200 rounded-full" />
                    <div className="h-5 w-16 bg-zinc-200 rounded-full" />
                  </div>
                </CardHeader>

                {/* Body: Các thanh tiêu đề cách đều */}
                <CardContent className="p-0 py-4 space-y-2.5">
                  <div className="h-4 w-4/5 bg-zinc-200 rounded-md" />
                  <div className="h-4 w-3/5 bg-zinc-200 rounded-md" />
                </CardContent>

                {/* Footer: Hạn nộp bên trái và nút bên phải tách biệt */}
                <CardFooter className="p-0 pt-3 border-t border-zinc-100 w-full block">
                  <div className="flex items-center justify-between w-full">
                    <div className="h-4 w-24 bg-zinc-200 rounded-md" />
                    <div className="h-7 w-20 bg-zinc-200 rounded-lg" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    return <WrappedComponent {...(props as P)} />;
  };

  ComponentWithLoading.displayName = `withLoading(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return ComponentWithLoading;
}
