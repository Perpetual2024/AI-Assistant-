import { useState } from 'react';
// import Loginpage from './components/Loginpage';
// import Signin from './components/Signinpage';
import ChatInterface from './client/components/ChatInterface';

import './App.css'

function App() {
  const [page, setPage] = useState("signin")
  
  return (
    // <div className="App">
    //   {page === "signin"
    //     ? <Signin onNavigateToSignup={() => setPage("signup")} />
    //     : <Loginpage onNavigateToLogin={() => setPage("signin")} />
    //   }
    // </div>
    <div> 
      <ChatInterface />
    </div>
  );
}

export default App;