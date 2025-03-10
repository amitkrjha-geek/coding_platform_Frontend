export const setToken = (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
};

export const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
};

export const removeToken = (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
};



// export const setAdminData = (admin: any): void => {
//     if (typeof window === "undefined") return;
//     localStorage.setItem("adminData", JSON.stringify(admin));
// };

// 
// export const getAdminData = (): any | null => {
//     if (typeof window === "undefined") return null;
//     const adminData = localStorage.getItem("adminData");
//     return adminData ? JSON.parse(adminData) : null;
// };

export const removeAdminData = (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("adminData");
};
