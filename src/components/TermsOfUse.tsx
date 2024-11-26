import React from 'react';
import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';

export default function TermsOfUse() {
  return (
    <div className="min-h-[80vh] container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <ScrollText className="w-8 h-8 text-amber-500" />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold mb-4 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Terms of Use
          </motion.h1>
        </div>

        <motion.div
          className="prose prose-invert max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-400">
              By using SparkConvert, you agree to these Terms of Use. If you do not agree with these terms, please do not use the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <p className="text-gray-400">
              SparkConvert is a free, browser-based file conversion service. We provide tools for converting various file formats locally in your browser.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            <p className="text-gray-400">
              Users are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-400">
              <li>Ensuring they have the right to convert and use the files</li>
              <li>Maintaining backups of their original files</li>
              <li>Using the service in compliance with applicable laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Limitations of Liability</h2>
            <p className="text-gray-400">
              SparkConvert is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Fair Usage</h2>
            <p className="text-gray-400">
              To ensure service quality for all users, we implement reasonable limits on file sizes and conversion frequencies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
            <p className="text-gray-400">
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
