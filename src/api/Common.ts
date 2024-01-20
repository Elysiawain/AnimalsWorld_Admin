import request from "@/utils/Request"
/**
 * 上传文件
 * @param file 
 * @returns 
 */
export const upload = (file:File) => {
    return request({
        url: "/upload",
        method: "post",
        data: {
            file: file
        }
    })
} 
