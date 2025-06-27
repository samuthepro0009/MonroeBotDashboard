import React from "react";
import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  animationType?: "stretch" | "elastic" | "bounce" | "glow" | "slide";
  glowColor?: string;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, animationType = "stretch", glowColor = "rgb(220, 38, 38)", children, ...props }, ref) => {
    const getAnimationProps = () => {
      switch (animationType) {
        case "stretch":
          return {
            whileHover: { 
              scaleX: 1.08, 
              scaleY: 0.96,
              transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
            },
            whileTap: { 
              scaleX: 0.95, 
              scaleY: 1.05,
              transition: { duration: 0.1, ease: "easeOut" }
            },
            transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
          };
        
        case "elastic":
          return {
            whileHover: { 
              scaleX: 1.1, 
              scaleY: 0.9,
              transition: { duration: 0.15, ease: [0.68, -0.55, 0.265, 1.55] }
            },
            whileTap: { 
              scaleX: 0.9, 
              scaleY: 1.1,
              transition: { duration: 0.1, ease: "easeOut" }
            },
            transition: { duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }
          };
        
        case "bounce":
          return {
            whileHover: { 
              scale: 1.05,
              y: -2,
              transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 17 }
            },
            whileTap: { 
              scale: 0.98,
              y: 0,
              transition: { duration: 0.1, ease: "easeOut" }
            }
          };
        
        case "glow":
          return {
            whileHover: { 
              scale: 1.02,
              boxShadow: `0 0 20px ${glowColor}40, 0 0 40px ${glowColor}20`,
              transition: { duration: 0.3 }
            },
            whileTap: { 
              scale: 0.98,
              transition: { duration: 0.1 }
            }
          };
        
        case "slide":
          return {
            whileHover: { 
              x: 2,
              scaleX: 1.02,
              transition: { duration: 0.2 }
            },
            whileTap: { 
              x: 0,
              scaleX: 0.98,
              transition: { duration: 0.1 }
            }
          };
        
        default:
          return {};
      }
    };

    return (
      <motion.div
        style={{ transformOrigin: "center" }}
        {...getAnimationProps()}
      >
        <Button
          className={cn(
            "relative overflow-hidden",
            animationType === "stretch" && "btn-stretch",
            animationType === "elastic" && "btn-elastic",
            className
          )}
          ref={ref}
          {...props}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          <span className="relative z-10">{children}</span>
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
export default AnimatedButton;