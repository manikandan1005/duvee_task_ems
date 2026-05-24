import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function DashBoardLayout({children}: {
  children: React.ReactNode;
}) {
return(
<div className="flex ">
    <div className="fixed top-0 left-0 z-10">
        <Sidebar/>
    </div>
    <div className="w-full ml-60">
        <div className="fixed top-0 w-full left-0 z-10 ml-60">
            <Navbar/>
        </div>
    <div style={{marginTop:"35px"}}>{children}</div>
    </div>
</div>
)
}