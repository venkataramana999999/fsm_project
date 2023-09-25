import React, { Suspense, useEffect } from "react"
import { useDispatch } from "react-redux"
import { authCheckState } from './redux/auth'
// ** Router Import
import Router from "./router/Router"

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(authCheckState())
  }, [])
  //console.log("heelloo---");
  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  )
}

export default App
