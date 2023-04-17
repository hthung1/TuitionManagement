import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token[0];
  };

  const [token, setToken] = useState(getToken());
  const saveToken = (userToken) => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken?.token[0]);
  };

  return {
    setToken: saveToken,
    token,
  };
}
