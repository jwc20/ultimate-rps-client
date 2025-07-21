import { useState, useEffect } from "react";

function LoadingOrEmptyMessage() {
    const [message, setMessage] = useState("Loading chat history...");

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage("No messages");
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#888",
                textAlign: "center",
            }}
        >
            <div>{message}</div>
        </div>
    );
}

export { LoadingOrEmptyMessage };
