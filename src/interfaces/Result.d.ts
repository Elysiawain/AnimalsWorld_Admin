/**
 * 返回类型
 */
interface Result<T> {
    code: number;
    message: string;
    data: T;
}