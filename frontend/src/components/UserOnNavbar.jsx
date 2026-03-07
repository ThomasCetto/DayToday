import GoogleSignInButton from "./GoogleSignInButton";


function UserOnNavbar() {
    const username = localStorage.username;
    
    return (
        <>
            <div id="userOnNavbar">
                {(username) ? 
                <div><h5>{username}</h5>  <button onClick={() => {delete localStorage.username; delete localStorage.token; window.location.reload() }}>Log out</button>  </div>
                : <GoogleSignInButton />}
                
            </div>
        </>
    )
}

export default UserOnNavbar;