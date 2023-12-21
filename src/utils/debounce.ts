// 定义防抖函数
export function debounce<T extends (...args: any[]) => any, U extends any>(func: T, delay: number, thisArg: U): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function (...args: Parameters<T>): void {
        // 使用显式类型注释来确保 this 被正确绑定
        const context = thisArg

        // 如果已经设置过时，清除之前设置的时钟
        if (timeout !== null) {
            clearTimeout(timeout)
        }

        // 设置新的时钟，延迟执行函数
        timeout = setTimeout(() => {
            func.apply(context, args)
            timeout = null
        }, delay)
    }
}
