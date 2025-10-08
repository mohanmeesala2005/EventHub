import { motion } from "framer-motion";

const Preloader = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 border-solid"
                style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent" }}
            />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="ml-4 text-blue-500 font-semibold text-lg"
            >
                Loading...
            </motion.span>
        </div>
    );
};

export default Preloader;    