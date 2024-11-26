import { Heart, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const DONATION_LINKS = [
  {
    name: 'Ko-fi',
    icon: CreditCard,
    url: 'https://ko-fi.com/levitate',
    color: 'bg-[#13C3FF]',
    textColor: 'text-white'
  }
];

export default function DonationPage() {
  return (
    <div className="min-h-[80vh] container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h1 
          className="text-4xl font-bold mb-6 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Support SparkConvert
        </motion.h1>
        
        <motion.p 
          className="text-gray-400 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          SparkConvert is free and open-source. Your support helps keep the project alive and enables new features.
        </motion.p>

        <div className="grid gap-6">
          {DONATION_LINKS.map((platform, index) => (
            <motion.a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-card p-6 rounded-xl hover-card transition-all duration-300 ${platform.color} ${platform.textColor} hover:opacity-90`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              aria-label={`Donate via ${platform.name}`}
            >
              <platform.icon className="w-8 h-8 mb-4 mx-auto" />
              <h2 className="text-lg font-semibold">{platform.name}</h2>
            </motion.a>
          ))}
        </div>

        <motion.p 
          className="mt-12 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your support is greatly appreciated! ❤️
        </motion.p>
      </div>
    </div>
  );
}
