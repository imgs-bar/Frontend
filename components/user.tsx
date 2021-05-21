import {useContext, createContext} from 'react';
import {IUserContext} from '../typings';

const UserContext = createContext(null);

export const UserProvider = ({
  value,
  children,
}: {
  value: any;
  children: any;
}) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useUser = () => useContext<IUserContext>(UserContext);
