import SignIn from './components/SignIn.tsx'
import SignUp from './components/SignUp.tsx'
import Admin from './components/Admin.tsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signIn" element={<SignIn />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Navigate to="/signIn" />} />
            </Routes>
        </Router>
    )
}

export default App;