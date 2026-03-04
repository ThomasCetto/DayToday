import { Link, Outlet, useLocation } from "react-router";
import "./AppLayout.css";
import { useState } from "react";

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    
    const location = useLocation();
    const titles = {
		"/": "Daily Tasks",
		"/add": "Add Task"
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
				</nav>
			</aside>

            <header className="navbar">
                <h1>{title}</h1>
            </header>
        
            <main className="content">
                <Outlet />
            </main>
		</div>
	);
}