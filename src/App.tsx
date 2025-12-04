import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Library } from "./pages/Library";
import { useEffect } from "react";
import { db } from "./db/db";

function App() {
  // DB Init Check
  useEffect(() => {
    db.open().catch((err) => console.error(err));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
          <Route
            path="/songbook"
            element={
              <div className="text-slate-500">
                Songbook Module (Coming Soon)
              </div>
            }
          />
          <Route
            path="/settings"
            element={
              <div className="text-slate-500">
                Settings Module (Coming Soon)
              </div>
            }
          />

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
