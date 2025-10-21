import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  CheckCircle,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";

export default function ContactUs() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "How do I book a tour with Pearl Pathways?",
      answer:
        "You can book a tour by browsing our available tours, selecting your preferred dates, and completing the booking form.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "Payment is manual. Please deposit the payment to our bank account and send us the bank slip via email to confirm your booking.",
    },
    {
      question: "Can I customize my tour itinerary?",
      answer:
        "Absolutely! We specialize in creating personalized experiences. Contact our team with your preferences, and we'll design a custom itinerary that matches your interests, budget, and schedule.",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "Cancellations made 7+ days before the tour receive a full refund. Cancellations 3-6 days before receive a 50% refund. Cancellations within 48 hours are non-refundable. We recommend travel insurance for flexibility.",
    },
    {
      question: "Are your guides certified and experienced?",
      answer:
        "Yes! All our guides are certified by the Sri Lanka Tourism Development Authority and have extensive experience. They are fluent in multiple languages and passionate about sharing Sri Lanka's culture and history.",
    },
    {
      question: "Do you provide travel insurance?",
      answer:
        "We recommend purchasing travel insurance separately. However, we can connect you with trusted insurance providers and help you understand what coverage you need for your Sri Lankan adventure.",
    },
  ];

  const stats = [
    { icon: CheckCircle, value: "98%", label: "Customer Satisfaction", color: "emerald" },
    { icon: Zap, value: "< 2hrs", label: "Average Response Time", color: "blue" },
    { icon: Users, value: "10k+", label: "Happy Travelers", color: "violet" },
    { icon: TrendingUp, value: "4.9/5", label: "Average Rating", color: "amber" },
  ];

  const colorClasses = {
    emerald: "from-emerald-500 to-teal-500",
    blue: "from-blue-500 to-sky-500",
    violet: "from-violet-500 to-purple-500",
    amber: "from-amber-500 to-orange-500",
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)",
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Say Hello to Pearl Pathways
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl font-medium">
            Let’s plan your dream Sri Lankan adventure together!
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {/* Call */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-7 h-7 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-2">+94 77 123 4567</p>
            <p className="text-gray-600">+94 11 234 5678</p>
          </div>

          {/* Email */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-2">info@pearlpathways.com</p>
            <p className="text-gray-600">support@pearlpathways.com</p>
          </div>

          {/* Visit */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-600">123 Temple Road</p>
            <p className="text-gray-600">Colombo 03, Sri Lanka</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${colorClasses[stat.color]} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ and Additional Info */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600 mb-8">
              Find answers to common questions about our tours and services.
            </p>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors duration-200"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                        openFaq === index ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openFaq === index ? "max-h-[1000px]" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 pb-5 pt-2 text-gray-700 leading-relaxed">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="space-y-8">
            {/* Office Hours */}
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-8 rounded-xl border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Office Hours</h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex justify-between">
                      <span className="font-medium">Monday - Friday:</span> <span>9:00 AM - 6:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Saturday:</span> <span>10:00 AM - 4:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Sunday:</span> <span>Closed</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Response */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Response</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We aim to respond to all inquiries within 24 hours. For urgent matters, please call us directly.
              </p>
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <Phone className="w-5 h-5" />
                <span>Emergency: +94 11 234 5678</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
