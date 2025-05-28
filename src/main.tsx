import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './styles/fonts.css'
import './styles/globalStyle.css'
import { NotificationContainer } from './components/notificationCard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <NotificationContainer />
  </StrictMode>,
)
