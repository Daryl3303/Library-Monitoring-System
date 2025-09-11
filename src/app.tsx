import SignIn from './components/SignIn.tsx'
import Admin from './components/Admin.tsx'
import UserMain from './components/UserMain.tsx'
import ProtectedRoute from './context/protectedRoute.tsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signIn" element={<SignIn />} />
                <Route path="/admin/*" element={
                    <ProtectedRoute>
                    <Admin />
                    </ProtectedRoute>} />
                <Route path="/user/*" element={
                     <ProtectedRoute>
                        <UserMain/>
                        </ProtectedRoute>} />
                 <Route path="/" element={<Navigate to="/signIn" />} />
                <Route path="*" element={<Navigate to="/signIn" />} />
            </Routes>
        </Router>
    )
}

export default App;