import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Archive from './Components/UI/Client/Archive/archive.tsx'
import MainClient from './Components/UI/Client/mainClient.tsx'
import CreateRequests from './Components/UI/Client/Create_Requests/createRequests.tsx'
import Acc from './Components/UI/Client/Acc/acc.tsx'
import ThemeProvider from './Theme/themeProvider.tsx'
import MainRegistrLog from './Components/UI/Registration_Log/mainRegistrLog.tsx'
import Login from './Components/UI/Registration_Log/Login/login.tsx'
import Registration from './Components/UI/Registration_Log/Registration_Users/registration.tsx'
import ArchRequests from './Components/UI/Client/Archive/Archive_Requests/archRequests.tsx'
import RegistrtionOperations from './Components/UI/Registration_Log/Registration_Operators/registrtionOperations.tsx'
import MainManagementSystem from './Components/UI/Management_System/mainManagementSystem.tsx'
import Tickets from './Components/UI/Management_System/Tickets/tickets.tsx'
import Analytics from './Components/UI/Management_System/Analytics/analytics.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
            <Route element={<App/>}>

              <Route element={<MainClient/>}>
                <Route path='archive' element={<Archive/>}>
                  <Route path=':id' element={<ArchRequests/>}/>
                </Route>
                <Route path='createReq' element={<CreateRequests/>}/>
                <Route path='acc' element={<Acc/>}/>
              </Route>

              <Route element={<MainRegistrLog/>}>
                <Route path='/' element={<Login/>}/>
                <Route path='registration' element={<Registration/>}/>
                <Route path='registrationOperations' element={<RegistrtionOperations/>}/>
              </Route>

              <Route element={<MainManagementSystem/>}>
                <Route path='tickets' element={<Tickets/>}/>
                <Route path='analytics' element={<Analytics/>}/>
              </Route>
            </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
