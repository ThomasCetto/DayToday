import { Link, Outlet, useLocation } from "react-router";
import "./AppLayout.css";
import { useState } from "react";
import UserOnNavbar from "./UserOnNavbar";

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    
    const location = useLocation();
    const titles = {
		"/": "Daily Tasks",
		"/add": "Add Task",
        "/login": "Login",
        "/edit": "Edit Tasks",
        "/addWords": "Add Words",
        "/words": "Learn Words"
	};
    const title = titles[location.pathname] || "DayToday";

	return (
		<div className={`layout ${sidebarOpen ? "" : "collapsed"}`}>
			<aside className="sidebar">
                <button
                    className="toggleButton"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    ☰
                </button>
				<nav className="sidebarNav">
					<Link to="/">Today</Link>
					<Link to="/add">Add task</Link>
                    <Link to="/edit">Edit tasks</Link>
                    <Link to="/words">Learn words</Link>
                    <Link to="/addWords">Add words</Link>  
				</nav>
			</aside>

            <header className="navbar">
                <h1>{title}</h1>
                <UserOnNavbar />
            </header>
        
            <main className="webpage-content">
                {(localStorage.username || location.pathname === '/login') ? 
                    <Outlet /> : 
                    <h2>You must be logged in to use this page</h2>
                }
            </main>
		</div>
	);
}