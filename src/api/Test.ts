import request from "@/utils/Request";

export const testGet = (username: string, password: string) => {
    return request({
        url: "/login",
        method: "post",
        data: {
            username, password
        }
    })
}