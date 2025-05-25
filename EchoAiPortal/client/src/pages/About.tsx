import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Code2, 
  Lightbulb, 
  Users, 
  Target, 
  Heart, 
  Zap,
  ArrowLeft,
  Globe,
  Rocket,
  Shield
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <Code2 className="h-8 w-8" />,
      title: "Code Excellence",
      description: "We believe in writing clean, efficient, and maintainable code. Every suggestion from Echo AI follows industry best practices."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Continuous Learning",
      description: "Technology evolves rapidly. We stay at the forefront of programming languages, frameworks, and development methodologies."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community First",
      description: "Our success is measured by the success of our developer community. We're here to help you grow and achieve your goals."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Passion for Development",
      description: "We're developers building for developers. We understand the challenges and joys of coding because we live them every day."
    }
  ];

  const features = [
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Smart Code Generation",
      description: "Advanced AI algorithms that understand context and generate production-ready code tailored to your needs."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your code and data remain private. We use enterprise-grade security to protect your intellectual property."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Universal Language Support",
      description: "From Python to Rust, JavaScript to Go - we support over 25 programming languages and frameworks."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Performance",
      description: "Sub-second response times ensure your development flow stays uninterrupted and productive."
    }
  ];

  return (
    <div className="min-h-screen bg-echo-dark text-white pt-20">
      {/* Header */}
      <section className="py-16 bg-echo-surface">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-8 text-echo-gray hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="text-white">About</span>{" "}
              <span className="echo-orange">Echo AI</span>
            </h1>
            <p className="text-xl text-echo-gray max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make coding accessible, enjoyable, and efficient for developers 
              at every stage of their journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-echo-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold">
                <span className="text-white">Our</span>{" "}
                <span className="echo-orange">Mission</span>
              </h2>
              <div className="space-y-6 text-lg text-echo-gray leading-relaxed">
                <p>
                  Echo AI was born from a simple observation: coding shouldn't be a barrier to bringing 
                  great ideas to life. Whether you're a student writing your first "Hello World" or 
                  a senior engineer architecting complex systems, everyone deserves intelligent assistance.
                </p>
                <p>
                  We've built Echo AI to be more than just a code generator. It's your coding companion 
                  that understands context, explains concepts clearly, and helps you learn while you build.
                </p>
                <p>
                  <span className="echo-amber font-semibold">Every interaction with Echo AI is designed 
                  to make you a better developer.</span> We don't just give you fish; we teach you how 
                  to fish in the vast ocean of programming possibilities.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Card className="bg-echo-surface border-gray-800 p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-echo-orange rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                </div>
                <p className="text-echo-gray leading-relaxed">
                  A world where programming knowledge is democratized, where the barrier between 
                  an idea and its implementation is minimal, and where every developer has access 
                  to expert-level guidance.
                </p>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-900 border-gray-800 p-6 text-center">
                  <div className="text-3xl font-bold echo-orange mb-2">500K+</div>
                  <div className="text-echo-gray text-sm">Lines of Code Generated</div>
                </Card>
                <Card className="bg-gray-900 border-gray-800 p-6 text-center">
                  <div className="text-3xl font-bold echo-orange mb-2">50K+</div>
                  <div className="text-echo-gray text-sm">Happy Developers</div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-echo-surface">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-white">Our</span>{" "}
              <span className="echo-orange">Values</span>
            </h2>
            <p className="text-xl text-echo-gray max-w-3xl mx-auto">
              These core principles guide everything we do, from product development 
              to customer support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-echo-dark border-gray-800 p-8 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-echo-orange rounded-lg flex items-center justify-center flex-shrink-0">
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                      <p className="text-echo-gray leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-20 bg-echo-dark">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-white">How Echo AI</span>{" "}
              <span className="echo-orange">Works</span>
            </h2>
            <p className="text-xl text-echo-gray max-w-3xl mx-auto">
              Behind the simple interface lies sophisticated AI technology designed 
              specifically for software development.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-echo-surface border-gray-800 p-6 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-echo-amber rounded-lg flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-echo-gray text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-echo-surface">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold">
              <span className="text-white">Built by</span>{" "}
              <span className="echo-orange">Developers</span>
            </h2>
            <p className="text-xl text-echo-gray max-w-2xl mx-auto leading-relaxed">
              Echo AI is created by a team of passionate developers who understand the daily 
              challenges of writing code. We use Echo AI ourselves, which means we're constantly 
              improving it based on real-world experience.
            </p>
            <Card className="bg-echo-dark border-gray-800 p-8 text-left max-w-2xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Why We Built Echo AI</h3>
                <blockquote className="text-echo-gray italic">
                  "We noticed that developers spend too much time on repetitive tasks and 
                  searching for solutions instead of focusing on creative problem-solving. 
                  Echo AI changes that by providing instant, intelligent assistance that 
                  feels like having a senior developer by your side."
                </blockquote>
                <div className="flex items-center space-x-3 mt-4">
                  <div className="w-10 h-10 bg-echo-orange rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">T</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Taha</div>
                    <div className="text-echo-gray text-sm">Founder & Lead Developer</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-echo-dark">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 text-center space-y-8"
        >
          <h2 className="text-4xl font-bold">
            <span className="text-white">Ready to Experience</span>{" "}
            <span className="echo-orange">Echo AI?</span>
          </h2>
          <p className="text-xl text-echo-gray max-w-2xl mx-auto">
            Join thousands of developers who are already coding smarter with Echo AI. 
            Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button className="bg-echo-orange hover:bg-echo-amber text-white px-8 py-4 text-lg font-bold transition-all duration-300 hover:scale-105">
                <Rocket className="mr-2 h-5 w-5" />
                Start Coding Now
              </Button>
            </Link>
            <Link href="/">
              <Button 
                variant="outline" 
                className="border-2 border-echo-orange text-echo-orange hover:bg-echo-orange hover:text-white px-8 py-4 text-lg font-bold transition-all duration-300"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
