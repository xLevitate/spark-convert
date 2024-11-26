import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-[80vh] container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <Shield className="w-8 h-8 text-amber-500" />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold mb-4 gradient-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Privacy Policy
          </motion.h1>
        </div>

        <motion.div
          className="prose prose-invert max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Data Collection</h2>
            <p className="text-gray-400">
              SparkConvert is designed with privacy in mind. We do not collect, store, or transmit any of your files or personal information. All file conversions happen locally in your browser, and your files never leave your device.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Local Processing</h2>
            <p className="text-gray-400">
              Our service operates entirely in your web browser using client-side technologies. No server processing is involved in the file conversion process, ensuring complete privacy of your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cookies & Local Storage</h2>
            <p className="text-gray-400">
              We use minimal local storage only to remember your conversion preferences. No tracking cookies or third-party analytics are used.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
            <p className="text-gray-400">
              We do not integrate with any third-party services that could compromise your privacy. The only external service we use is Ko-fi for voluntary donations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Updates to Privacy Policy</h2>
            <p className="text-gray-400">
              We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated revision date.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
