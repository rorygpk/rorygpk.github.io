import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { Home } from "./pages/Home";
import { Work } from "./pages/Work";
import { Mail } from "./pages/Mail";
import { RoryGpkos } from "./pages/RoryGpkos";
import { Msfs } from "./pages/Msfs";
import { Remote } from "./pages/Remote";
import { Videos } from "./pages/Videos";
import { Friendship } from "./pages/Friendship";
import { Blog } from "./pages/Blog";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="work" element={<Work />} />
        <Route path="mail" element={<Mail />} />
        
        {/* Isolated Branches */}
        <Route path="rory-gpkos" element={<RoryGpkos />} />
        <Route path="msfs" element={<Msfs />} />
        <Route path="remote" element={<Remote />} />
        <Route path="videos" element={<Videos />} />
        <Route path="friendship" element={<Friendship />} />
        <Route path="blog" element={<Blog />} />
      </Route>
    </Routes>
  );
}
