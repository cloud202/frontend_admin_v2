import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react';
import { CognitoJwtVerifier } from "aws-jwt-verify";
import Cookies from "js-cookie";
const root = ReactDOM.createRoot(document.getElementById('root'));
const validatetoken = async() =>{
    // console.log(window.location.href);
    const url = window.location.href;
    const getTokenFromURL = (url, tokenName) => {
      const params = new URLSearchParams(url.split('#')[1]);
      return params.get(tokenName);
    };
   
    const idToken = getTokenFromURL(url, 'id_token');
    const accessToken = getTokenFromURL(url, 'access_token');
   
    // console.log('id_token:', idToken);
    // console.log('access_token:', accessToken);
   if(idToken){
    if(idToken!==Cookies.get("token")){
      Cookies.set("token", idToken, {
        expires: 1,
      });
    }
   }
    
    // alert(Cookies.get("token"))
   
    const idTokenVerifier = CognitoJwtVerifier.create({
     userPoolId: "eu-west-1_w86oJnAAs",
     tokenUse: "id",
     clientId: "6ukej354mcsfff09lrvmanmjeh",
    });
    try {
     const idTokenPayload = await idTokenVerifier.verify(Cookies.get("token"));
     console.log("Token is valid. Payload:", idTokenPayload);
     const username = idTokenPayload["cognito:username"];
     Cookies.set("email", idTokenPayload.email, {
      expires: 1,
    });
    Cookies.set("username", username, {
     expires: 1,
   });
    } catch {
     console.log("Token not valid!");
     window.location.replace(`${process.env.REACT_APP_COGNITO}login?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`);
    }
   
    
    }
    validatetoken();
root.render(
    <ChakraProvider>
     <App />
    </ChakraProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
