import { Link, Outlet, useLocation } from "react-router";
import "./AppLayout.css";
import { useState } from "react";
import UserOnNavbar from "./UserOnNavbar";
import LoginPage from "../pages/Login/LoginPage";

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

    // Auth layout is used because the google login button has to be rendered only once, otherwise it gives an harmless warning
    // So I make it render once and display it only when on the login page
    const authLayout = (
        <div className={"auth-layout-container " + ((location.pathname === '/login') ? 'visible' : '')}>
            <LoginPage />
        </div>
    );

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
                {authLayout}  {/* Render only once */}

                {(localStorage.username || location.pathname === '/login') ? 
                    <Outlet /> : 
                    <h2>You must be logged in to use this page</h2>
                }
            </main>
		</div>
	);
}