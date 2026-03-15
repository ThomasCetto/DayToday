import './App.css'
import CreateTaskForm from './pages/CreateTask/CreateTaskForm'
import DayTasksList from './pages/TaskList/DayTasksList'
import { Routes, Route, Link, Outlet } from "react-router"
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/Login/LoginPage';
import EditTasksPage from './pages/EditTask/EditTasksPage';
import AddWordsPage from './pages/AddWords/AddWordsPage';
import LearnWordsPage from './pages/LearnWords/LearnWordsPage';


function App() {
    return (
		<>
			<Routes>
                <Route element={<AppLayout/>}>
                    <Route path="/" element={<DayTasksList />} />
                    <Route path="/add" element={<CreateTaskForm />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/edit" element={<EditTasksPage />} />
                    <Route path="/addWords" element={<AddWordsPage />} />
                    <Route path="/words" element={<LearnWordsPage />} />
                </Route>
			</Routes>
		</>
	);
}



export default App
