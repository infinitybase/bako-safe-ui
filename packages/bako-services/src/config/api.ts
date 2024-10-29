// import axios from "axios";

// import { CookieName, CookiesConfig } from "./cookies";
// import { ApiUnauthorizedErrorsTitles } from "..";

// // const { VITE_API_URL } = import.meta.env;
// const VITE_API_URL = "http://localhost:5173";

// const { ACCESS_TOKEN, ADDRESS } = CookieName;

// export interface ISetupAxiosInterceptors {
//   isTxFromDapp: boolean;
//   logout: (removeTokenFromDb?: boolean) => void;
// }

// export const api = axios.create({
//   baseURL: VITE_API_URL,
//   timeout: 10 * 1000, // limit to try other requests
// });

// export const useSetupAxiosInterceptors = () => {
//   api.interceptors.request.use(
//     (value) => {
//       const accessToken = CookiesConfig.getCookie(ACCESS_TOKEN);
//       const address = CookiesConfig.getCookie(ADDRESS);

//       if (accessToken) value.headers["authorization"] = accessToken;
//       if (address) value.headers["signerAddress"] = address;

//       return value;
//     },
//     (error) => error
//   );

//   api.interceptors.response.use(
//     async (config) => config,
//     async (error) => {
//       const unauthorizedError = error.response?.status === 401;

//       if (
//         unauthorizedError
//         // !isTokenExpired
//         // && !isTxFromDapp
//       ) {
//         const tokenExpiredError =
//           error.response?.title === ApiUnauthorizedErrorsTitles.EXPIRED_TOKEN;

//         // setIsTokenExpired(true);
//         // logout(tokenExpiredError);
//       }

//       return Promise.reject(error);
//     }
//   );
// };
