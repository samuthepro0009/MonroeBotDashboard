import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type LoginRequest } from "@shared/schema";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Bot, Loader2, Shield, Zap } from "lucide-react";
import PageLoader from "@/components/ui/page-loader";

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const onSubmit = async (data: LoginRequest) => {
    await login(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <PageLoader 
          size="lg" 
          text="Authenticating..." 
          variant="bot" 
        />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
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
        delay: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-border/50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="relative w-20 h-20 mx-auto mb-6"
            variants={logoVariants}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Bot className="text-white text-3xl" />
            </div>
            
            {/* Animated rings */}
            <motion.div
              className="absolute inset-0 border-2 border-primary/30 rounded-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-[-8px] border border-primary/20 rounded-3xl"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-2"
            variants={itemVariants}
          >
            Monroe Bot
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-lg"
            variants={itemVariants}
          >
            Dashboard Access
          </motion.p>
          
          {/* Feature highlights */}
          <motion.div 
            className="flex justify-center space-x-6 mt-6"
            variants={itemVariants}
          >
            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mb-1">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Secure</span>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mb-1">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Fast</span>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mb-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Smart</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground text-sm font-medium">Username</FormLabel>
                        <FormControl>
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Input
                              {...field}
                              type="text"
                              placeholder="Enter your username"
                              className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground text-sm font-medium">Password</FormLabel>
                        <FormControl>
                          <motion.div
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Input
                              {...field}
                              type="password"
                              placeholder="Enter your password"
                              className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-red-600 text-primary-foreground font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 border-0 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={form.formState.isSubmitting ? {} : { x: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="relative z-10 flex items-center justify-center">
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </span>
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>
        
        {/* Additional info */}
        <motion.div 
          className="mt-6 text-center"
          variants={itemVariants}
        >
          <p className="text-xs text-muted-foreground">
            Advanced Discord Bot Management System
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
