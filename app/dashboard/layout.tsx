import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function DashBoardLayout({children}: {
  children: React.ReactNode;
}) {
return(
<div className="flex ">
    <Sidebar/>
    <div className="w-full">
        <Navbar/>
    {children}
    </div>
</div>
)
}