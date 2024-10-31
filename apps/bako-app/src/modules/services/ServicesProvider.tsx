// import { createContext, useContext } from 'react';

// import { useSetupAxiosInterceptors } from '@/config';

//  import { useBakoServices } from './services-initializer';

// export type IServicesProvider = ReturnType<typeof useBakoServices>;

// const ServicesProviderContext = createContext<IServicesProvider | null>(null);

// const ServicesProvider = ({ children }: { children: React.ReactNode }) => {
//   const bakoServices = useBakoServices();

//   useSetupAxiosInterceptors({
//     isTxFromDapp: false,
//     isTokenExpired: false,
//     setIsTokenExpired: () => false,
//     logout: () => {},
//   });

//   return (
//     <ServicesProviderContext.Provider value={bakoServices}>
//       {children}
//     </ServicesProviderContext.Provider>
//   );
// };
// export default ServicesProvider;

// const useServicesContext = () => {
//   const context = useContext(ServicesProviderContext);
//   if (!context) {
//     throw new Error('useServicesContext must be used within ServicesProvider');
//   }

//   return context;
// };

// export { ServicesProvider, useServicesContext };
