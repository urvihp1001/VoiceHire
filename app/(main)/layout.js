//in () since not a route
import DashboardProvider from "./provider"
function DashboardLayout({children}){
    return (
        <div className="p-10">
            <DashboardProvider>
                <div className="p-10">
                {children}
                </div>
           
            </DashboardProvider>
        </div>
    )
}
export default DashboardLayout