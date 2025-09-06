import "@/styles/403.css"
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
    const navigate = useNavigate()
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div className="container">
                    <div className="page-wrap">
                        <div className="page-not-found">
                            <img src="https://res.cloudinary.com/razeshzone/image/upload/v1588316204/house-key_yrqvxv.svg" className="img-key" alt="" />
                            <h1 className="text-xl">
                                <span>4</span>
                                <span>0</span>
                                <span className="broken">3</span>
                            </h1>
                            <h4 className="text-md">Access Denied !</h4>
                            <h4 className="text-sm text-sm-btm"><a href="#" onClick={() => navigate(-1)}>Previous page</a></h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}