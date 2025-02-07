import { useState } from "react";
import  "./App.css"
import Content from "./Content";

function App() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <div className="App"  >
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <p className="back" onClick={() => setIsCollapsed(!isCollapsed)} style={{ margin:"0",width:"100%" ,display:"flex" ,justifyContent:"right"}}><i class="fa-solid fa-backward" style={{color:" #000000" ,background:"gold",width:"20px" ,padding:" 2px 4px"}}></i></p>
        <Content/>
      </div>
     

      
      <div className="box" style={{ display:"inline-flex",
        height:"100vh",
        width:"100vw",
        border:"2px solid black",
        background:"url(ab.png) no-repeat",
        backgroundSize:"100% 100vh",
        position:"fixed",
        overflow:"hidden"
      }}> 
       <i onClick={() => setIsCollapsed(!isCollapsed)} class="fa-solid fa-circle-chevron-left"  ></i>
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", width:"90vw"}} className="b2"> 
        <p><img 
              style={{ filter: "drop-shadow(100px 50px 2px  rgb(0, 0, 0) ) " }} 
              src="j1.png" 
               alt="Shadowed Image" 
/>
</p>
         </div>
      </div>
    </div>
  );
}

export default App;
