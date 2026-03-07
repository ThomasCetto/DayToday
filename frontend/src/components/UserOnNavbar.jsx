import { useEffect, useRef, useState } from "react";
import GoogleSignInButton from "./GoogleSignInButton";
import "./UserOnNavbar.css";
import { useNavigate } from "react-router";


function UserOnNavbar() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const username = localStorage.username;
    return (
        <>
            <div id="user-on-navbar" ref={menuRef}>                     {/* User button on navbar */}
                {!username && (  // Not logged in
                    <button 
                        className="menu-button"
                        onClick={() => {
                            // Redirect to login page
                            //navigate("/login");
                            navigate("/login");
                            console.log("ciao")
                        }}>
                        Log in
                    </button>

                    // <Link to="/login" className="menu-button">Log in</Link>
                )}

                {username && (  // Logged in
                    <button 
                            className="menu-button"
                            onClick={() => {
                                setOpen((prev) => !prev);
                            }}>
                            {username ? username : "Log in"}
                        </button>
                )}

                {username && open && (
                    <>
                        <div className="dropdown-menu">                 {/* Options below user button */}
                            <button                                     /* Profile page button */
                                className="dropdown-item"
                                onClick={() => { 
                                    //TODO
                                    console.log("Edit profile")
                                }}
                            >
                                Edit profile
                            </button>
                            
                            <button                                     /* Log out button */
                                className="dropdown-item"
                                onClick={() => {
                                    delete localStorage.username;
                                    delete localStorage.token;
                                    setOpen(false);
                                    window.location.reload();
                                }}
                            >
                                Log out
                            </button>
                        </div>
                    </>
                )}

                

                {/* <GoogleSignInButton /> */}





                {/* {(username) ? 
                <div><h5>{username}</h5>  <button onClick={() => {delete localStorage.username; delete localStorage.token; window.location.reload() }}>Log out</button>  </div>
                : <GoogleSignInButton />} */}
                
            </div>
        </>
    )
}

export default UserOnNavbar;