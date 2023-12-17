import request from "@/utils/Request"
export const upload = (file:File) => {
    return request({
        url: "/upload",
        method: "post",
        data: {
            file: file
        }
    })
} 