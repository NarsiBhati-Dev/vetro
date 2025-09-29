import Dashboard from "./dashboard/Dashboard";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="bg-gradient-to-br from-sky-500/40 via-transparent to-transparent">
      <div className="bg-gradient-to-tr from-white via-transparent to-white h-screen">
        <Toaster richColors />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
