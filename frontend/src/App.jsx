import './App.css'
import CreateTaskForm from './components/CreateTaskForm'
import DayTasksList from './components/DayTasksList'
import { Routes, Route, Link } from "react-router"
function App() {
    return (
		<>
			<nav>
				<Link to="/">Home</Link>
				<Link to="/add">Add task</Link>
			</nav>

			<Routes>
				<Route path="/" element={<DayTasksList />} />
				<Route path="/add" element={<CreateTaskForm />} />
			</Routes>
		</>
	);
}



export default App
