export function formatTimeDifference(startTimestamp: number, endTimestamp: number): string {
    const start = new Date(startTimestamp);
    const end = new Date(endTimestamp);
    const timeDiff = end.getTime() - start.getTime();
    const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数

    if (timeDiff < oneDay && end.getDate() === start.getDate()) {
        return `${start.getHours()}:${start.getMinutes() < 10 ? '0' + start.getMinutes() : start.getMinutes()}`;
    } else if (timeDiff < 2 * oneDay && end.getDate() - start.getDate() === 1) {
        return `昨天 ${start.getHours()}:${start.getMinutes() < 10 ? '0' + start.getMinutes() : start.getMinutes()}`;
    } else if (timeDiff < 3 * oneDay && end.getDate() - start.getDate() === 2) {
        return `前天 ${start.getHours()}:${start.getMinutes() < 10 ? '0' + start.getMinutes() : start.getMinutes()}`;
    } else if (timeDiff < 7 * oneDay) {
        const daysAgo = Math.floor(timeDiff / oneDay);
        return `${daysAgo}天前 ${start.getHours()}:${start.getMinutes() < 10 ? '0' + start.getMinutes() : start.getMinutes()}`;
    } else if (start.getFullYear() === end.getFullYear()) {
        return `${start.getMonth() + 1}月${start.getDate()}日 ${start.getHours()}:${start.getMinutes() < 10 ? '0' + start.getMinutes() : start.getMinutes()}`;
    } else {
        return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日 ${start.getHours()}:${start.getMinutes() < 10 ? '0' + start.getMinutes() : start.getMinutes()}`;
    }
}

/**
 * 格式转换
 * @param timestamp
 */
export function formatDate(timestamp: number): string {
    // 创建一个新的 Date 对象，并传入时间戳作为参数
    const date = new Date(timestamp)

    // 使用toLocaleString()方法将日期对象转换为指定格式的字符串
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
export function formatDate_1(timestamp: number): string {
    // 创建一个新的 Date 对象，并传入时间戳作为参数
    const date = new Date(timestamp)

    // 使用toLocaleString()方法将日期对象转换为指定格式的字符串
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
