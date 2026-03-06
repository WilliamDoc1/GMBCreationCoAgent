"use client";

import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import Footer from "@/components/Footer";
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, TrendingUp, Image as ImageIcon, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      title: "Google Post Automation",
      description: "3x Weekly SEO-optimized updates to keep your profile 'Fresh' in Google's eyes. We handle the content, keywords, and scheduling so you stay relevant.",
      icon: Calendar,
      color: "text-blue-500",
      span: "md:col-span-2"
    },
    {
      title: "Smart Review Management",
      description: "Automated review solicitation via professional SMS/Email with AI-drafted responses to boost your rating.",
      icon: MessageSquare,
      color: "text-green-500",
      span: "md:col-span-1"
    },
    {
      title: "Local SEO Insights",
      description: "Monthly performance reports tracking 'Near Me' search rankings and call volume. Know exactly where you stand.",
      icon: TrendingUp,
      color: "text-amber-500",
      span: "md:col-span-1"
    },
    {
      title: "Photo & Logo Optimization",
      description: "Metadata-rich image uploads to boost visual engagement and trust. We ensure your photos are geotagged and optimized for search.",
      icon: ImageIcon,
      color: "text-purple-500",
      span: "md:col-span-2"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Powerful Features for <br />
              <span className="text-primary">Local Dominance</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to automate your Google Business Profile and outrank the competition.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className={feature.span}>
                <Card className="h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4`}>
                      <feature.icon size={24} className={feature.color} />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;