import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";

import App from './App.tsx'
import './index.css'

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";

import Loader from './atom/Loader.tsx';

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>

      <App />
      </PersistGate>
    </Provider>
  // </StrictMode>
);
