'use client';

import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

export function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Profile Image */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-primary-500 to-purple-500 p-1">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                <span className="text-4xl font-bold gradient-text">MA</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Hi, I'm <span className="gradient-text">Monther Alzamli</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Full Stack Developer specializing in React, Next.js, and modern web
            technologies. I create beautiful, functional, and user-centered
            digital experiences.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="#projects"
              className="btn-primary inline-flex items-center justify-center px-8 py-3 text-lg"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="btn-secondary inline-flex items-center justify-center px-8 py-3 text-lg"
            >
              Get In Touch
            </a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-12">
            <a
              href="https://github.com/MontherIsmail"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200 dark:text-gray-400 dark:hover:text-primary-400"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/MontherAlzamli"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200 dark:text-gray-400 dark:hover:text-primary-400"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:monther@example.com"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200 dark:text-gray-400 dark:hover:text-primary-400"
            >
              <Mail size={24} />
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce-slow">
            <a
              href="#about"
              className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
            >
              <ArrowDown size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
