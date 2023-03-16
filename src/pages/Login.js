import axios from 'axios';
import React, { createContext, Fragment, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../components/shared/constraints';

const Login = () => { 
  const username = useRef("");
  const password = useRef("");
  const [token, setToken] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  
  useEffect(()=>{
    if(cookies.token) {
        setToken(cookies.token);
        setHasToken(true);
        navigate("/ClassList")
    }
  },[token])

  function login() {
    axios.post(BaseUrl + "auth/",
      {
          username: username.current.value,
          password: password.current.value,
      })
      .then(response =>  {
          setToken(response.data.token);                    
          setHasToken(true);         

          let cookieLife = new Date();
          cookieLife.setTime(cookieLife.getTime() + 60*60*1000);
          setCookie("token", response.data.token, {
            path:'/', 
            expires: cookieLife
          });                    
          window.location.reload(false);
          navigate("/ClassList");                    
      })
      .catch(error => {
          console.log(error);
      });
    }

    function logout() {
      let login_token = token;
      axios.get(BaseUrl+"auth/logout/",
          {
              headers: {
                  'Authorization': 'token '+ login_token,
              }
          })
          .then(response => {
              console.log(response);
              removeCookie("token", {path:'/'});
              setToken("");
              setHasToken(false);
              navigate("/Home")
          })
          .catch(error => {
              console.log(error);
          })

    }

  return (
    <div>
      {hasToken?
        <Fragment>
            <button className={"btn btn-secondary"} onClick={logout}>Logout</button>
        </Fragment>
      :
        <Fragment>
          <section className={"mt-5 p-4 d-flex justify-content-center pb-4"}>
            <div className={"bg-white border rounded-5"}>
              <section className={"w-100 p-4 d-flex justify-content-center pb-4"}>
                <div style={{width: "26rem"}}>
                  <div className={"form-group clearfix m-2"}>
                    <label className={"col-md-4 control-label text-right "}>Username</label>
                    <div>
                      <input className={"form-control"} ref={username} />
                    </div>
                  </div>
                  <div className={"form-group clearfix m-2"}>
                    <label className={"col-md-4 control-label text-right"}>Password</label>
                    <div>
                        <input className={"form-control"} ref={password} type={"password"} />
                    </div>
                  </div>
                  <div className={"col-md-offset-4 mt-5 ms-5 me-5"}>
                    <button className={"btn btn-success form-control"} onClick={login} >Login</button>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </Fragment>
      }
    </div>
  );
};

export default Login;