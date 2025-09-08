import { Outlet } from "react-router-dom";
import Header from "./_components/header";
import Footer from "./_components/footer";
export default function HomeTemplate() {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}
