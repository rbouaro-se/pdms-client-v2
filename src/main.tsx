import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { FontProvider } from './context/font-context'
import { ThemeProvider } from './context/theme-context'
import { Provider } from "react-redux";
import { store } from './redux/store.ts'
import './index.css'

import PersistLogin from './routes/PersistLogin'
import AppRoutes from './routes/AppRoutes'
import { BrowserRouter as Route } from "react-router-dom";

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <Provider store={store}>
      <Route>
        <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
          <FontProvider>
            <PersistLogin>
              <AppRoutes />
            </PersistLogin>
          </FontProvider>
        </ThemeProvider>
      </Route>
    </Provider>
    </StrictMode>
  )
}
