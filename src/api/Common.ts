import request from "@/utils/Request"

/**
 * 上传文件
 * @returns
 * @param img
 */
export const upload = (img: File) => {
    const file = new FormData()
    file.append('file', img)
    return request<any, Result<string>>({
        url: "/upload",
        method: "post",
        data: file
    })
}
