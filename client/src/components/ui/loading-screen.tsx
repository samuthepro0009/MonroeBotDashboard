import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Shield, Zap, Users, MessageSquare, Activity } from "lucide-react";

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const LoadingScreen = ({ onComplete, duration = 3000 }: LoadingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const loadingSteps = [
    { icon: Bot, text: "Initializing Monroe Bot", color: "from-blue-500 to-purple-600" },
    { icon: Shield, text: "Securing Connection", color: "from-green-500 to-blue-500" },
    { icon: Zap, text: "Loading Dashboard", color: "from-yellow-500 to-orange-500" },
    { icon: Users, text: "Syncing User Data", color: "from-purple-500 to-pink-500" },
    { icon: MessageSquare, text: "Preparing Commands", color: "from-cyan-500 to-blue-500" },
    { icon: Activity, text: "Finalizing Setup", color: "from-red-500 to-pink-500" }
  ];

  useEffect(() => {
    const stepDuration = duration / loadingSteps.length;
    const progressInterval = 50;
    const progressStep = 100 / (duration / progressInterval);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + progressStep;
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          setIsComplete(true);
          setTimeout(() => {
            onComplete?.();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, progressInterval);

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepTimer);
        return prev;
      });
    }, stepDuration);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, [duration, loadingSteps.length, onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.5 }
    }
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 1
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: { scale: 0, opacity: 0 }
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const CurrentIcon = loadingSteps[currentStep]?.icon || Bot;

  if (isComplete) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            {/* Main logo with pulsing animation */}
            <motion.div
              className="mb-8 flex justify-center"
              variants={logoVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="relative">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-primary to-red-600 rounded-2xl shadow-2xl flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(220, 38, 38, 0.3)",
                      "0 0 40px rgba(220, 38, 38, 0.6)",
                      "0 0 20px rgba(220, 38, 38, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bot className="w-12 h-12 text-white" />
                </motion.div>
                
                {/* Rotating rings around logo */}
                <motion.div
                  className="absolute inset-0 border-2 border-primary/30 rounded-2xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-[-8px] border border-primary/20 rounded-3xl"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent mb-2"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Monroe Bot Dashboard
            </motion.h1>

            <motion.p
              className="text-muted-foreground mb-12 text-lg"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              Advanced Discord Bot Management System
            </motion.p>

            {/* Current loading step */}
            <div className="mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  className="flex items-center justify-center space-x-3 mb-4"
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${loadingSteps[currentStep]?.color || 'from-primary to-red-600'} flex items-center justify-center shadow-lg`}>
                    <CurrentIcon className="w-6 h-6 text-white" />
                  </div>
                  <motion.span
                    className="text-lg font-medium"
                    variants={textVariants}
                  >
                    {loadingSteps[currentStep]?.text || "Loading..."}
                  </motion.span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="w-80 mx-auto mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-red-600 rounded-full shadow-lg"
                  style={{ width: `${progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Loading dots */}
            <div className="flex justify-center space-x-1">
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

            {/* Fun loading messages */}
            <motion.div
              className="mt-8 text-sm text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🤖 Preparing your bot control center...
            </motion.div>
          </div>
        </motion.div>
  );
};

export default LoadingScreen;