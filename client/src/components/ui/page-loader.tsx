import { motion } from "framer-motion";
import { Loader2, Bot } from "lucide-react";

interface PageLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  variant?: "spinner" | "dots" | "pulse" | "bot";
}

const PageLoader = ({ 
  size = "md", 
  text = "Loading...", 
  variant = "bot" 
}: PageLoaderProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const containerSizes = {
    sm: "p-4",
    md: "p-8",
    lg: "p-12"
  };

  if (variant === "spinner") {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mb-2`} />
        {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
        <div className="flex space-x-1 mb-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
        <motion.div
          className={`${sizeClasses[size]} bg-primary rounded-full mb-3`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
      </div>
    );
  }

  // Bot variant (default)
  return (
    <div className={`flex flex-col items-center justify-center ${containerSizes[size]}`}>
      <motion.div
        className="relative mb-4"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary to-red-600 rounded-lg flex items-center justify-center shadow-lg`}>
          <Bot className="w-1/2 h-1/2 text-white" />
        </div>
        <motion.div
          className="absolute inset-0 border-2 border-primary/30 rounded-lg"
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      {text && (
        <motion.p
          className="text-sm text-muted-foreground text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default PageLoader;