import UserStore from "../data/stores/UserStore";
import Storage from "../utils/storage";

const sto = new Storage({
    cookieList: ["token"]
})


export const loginSucc = rs => {
    console.log("recovery>")
    UserStore.copyFrom(rs.result.user);
    console.log("cache>")
    console.log("token>", rs.result.token)
    sto.setItem("token", rs.result.token)
}

export const loginOut = () => {
    localStorage.clear();
    // sto.setItem("token","")
}

