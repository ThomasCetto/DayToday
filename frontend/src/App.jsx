import './App.css'
import CreateTaskForm from './components/CreateTaskForm'
import DayTasksList from './components/DayTasksList'
import { Routes, Route, Link, Outlet } from "react-router"
import AppLayout from './layouts/AppLayout';
function App() {
    return (
		<>
			<Routes>
                <Route element={<AppLayout/>}>
                    <Route path="/" element={<DayTasksList />} />
                    <Route path="/add" element={<CreateTaskForm />} />
                </Route>
			</Routes>
		</>
	);
}



export default App
