'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Building2, Key, ClipboardList, HardHat, Home, Star, Sparkles } from 'lucide-react';
import { services, testimonials } from '@/lib/data';
import PropertySlider from '@/components/PropertySlider';
import ImageWithLoader from '@/components/ImageWithLoader';
import { useGetPropertiesQuery } from '@/lib/store/api/propertyApi';

export default function HomePage() {
    const { data: propertiesData, isLoading: loading, error } = useGetPropertiesQuery({ page_size: 6, ordering: '-created_at' });
    const properties = propertiesData?.results || [];
    const totalCount = propertiesData?.count || 0;
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);

    // Hero background images for sliding effect
    const heroImages = [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80', // Luxury home
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80', // Modern villa
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80', // Property management
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=80', // Construction
    ];

    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <div className="pt-20 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] sm:min-h-[90vh] md:h-screen flex items-center justify-center overflow-hidden w-full">
                {/* Sliding Background Images with Parallax */}
                <motion.div style={{ y }} className="absolute inset-0 z-0 will-change-transform overflow-hidden">
                    {heroImages.map((image, index) => (
                        <motion.div
                            key={image}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: currentImageIndex === index ? 1 : 0,
                                scale: currentImageIndex === index ? 1 : 1.05,
                            }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                            className="absolute inset-0 overflow-hidden"
                        >
                            <ImageWithLoader
                                src={image}
                                alt={`Hero ${index + 1}`}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                        </motion.div>
                    ))}
                    <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/70" />
                </motion.div>

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-10 w-20 h-20 bg-emerald-400/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            y: [0, 30, 0],
                            rotate: [0, -5, 0]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-1/4 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
                        className="w-full"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8 border border-white/20"
                        >
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 shrink-0" />
                            <span className="text-white font-medium text-xs sm:text-sm md:text-base">Premier Real Estate Since 2017</span>
                        </motion.div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                            Your Complete<br />
                            <span className="bg-linear-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                                Real Estate Solution
                            </span>
                        </h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 mb-6 max-w-3xl mx-auto leading-relaxed"
                        >
                            From luxury properties to construction, management to consultancy
                        </motion.p>

                        {/* Services Highlights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-10 max-w-4xl mx-auto w-full px-4"
                        >
                            {[
                                { icon: Building2, label: 'Real Estate' },
                                { icon: Key, label: 'Property Mgmt' },
                                { icon: ClipboardList, label: 'Consultancy' },
                                { icon: HardHat, label: 'Construction' },
                                { icon: Home, label: 'Short-Let' }
                            ].map((service, index) => (
                                <motion.div
                                    key={service.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="bg-white/10 backdrop-blur-md px-3 sm:px-3 md:px-4 py-2 sm:py-2 rounded-full border border-white/20 flex items-center gap-1.5 sm:gap-2"
                                >
                                    <service.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-300 shrink-0" />
                                    <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">{service.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-md mx-auto"
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:flex-1">
                                <Link
                                    href="/properties"
                                    className="bg-[#3a3a41] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl hover:shadow-2xl hover:shadow-gray-500/50 transition-all font-semibold flex items-center justify-center gap-2 group hover:bg-[#2a2a31] w-full text-sm sm:text-base"
                                >
                                    Explore
                                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform shrink-0" />
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:flex-1">
                                <Link
                                    href="/contact"
                                    className="bg-white/10 backdrop-blur-md text-white border-2 border-white/50 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-all font-semibold w-full flex items-center justify-center text-sm sm:text-base"
                                >
                                    Contact Us
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Slide Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-24 sm:bottom-32 left-1/2 transform -translate-x-1/2 z-20 flex gap-2"
                >
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className="group"
                        >
                            <div
                                className={`h-1 rounded-full transition-all duration-300 ${currentImageIndex === index
                                    ? 'w-8 sm:w-12 bg-white'
                                    : 'w-6 sm:w-8 bg-white/40 group-hover:bg-white/60'
                                    }`}
                            />
                        </button>
                    ))}
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 z-20"
                >
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center backdrop-blur-sm">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 h-1.5 bg-white rounded-full mt-2"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-12 sm:py-16 bg-[#3a3a41]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">8+</div>
                            <div className="text-gray-200 text-sm sm:text-base">Years Experience</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{totalCount || 50}+</div>
                            <div className="text-gray-200 text-sm sm:text-base">Properties Managed</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">200+</div>
                            <div className="text-gray-200 text-sm sm:text-base">Happy Clients</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">5</div>
                            <div className="text-gray-200 text-sm sm:text-base">Core Services</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Latest Properties */}
            <section className="py-12 sm:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12 px-4"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Latest Properties
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover our newest property listings
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        </div>
                    ) : properties.length > 0 ? (
                        <PropertySlider properties={properties} />
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-600 text-lg">No properties available at the moment.</p>
                        </div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-16"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/properties"
                                className="inline-flex items-center gap-2 bg-[#3a3a41] text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-gray-500/50 transition-all font-semibold group hover:bg-[#2a2a31]"
                            >
                                View All Properties
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-12 sm:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12 px-4"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Our Services
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                            Comprehensive real estate solutions tailored to your needs
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {services.map((service, index) => {
                            const iconMap: Record<string, any> = {
                                Building2,
                                Key,
                                ClipboardList,
                                HardHat,
                                Home
                            };
                            const Icon = iconMap[service.icon] || Building2;

                            return (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gray-50 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all transform hover:-translate-y-2 duration-300"
                                >
                                    <div className="bg-gray-100 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                                        <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-[#3a3a41]" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">{service.description}</p>
                                    <Link
                                        href="/services"
                                        className="text-[#3a3a41] font-semibold flex items-center gap-2 hover:gap-3 transition-all text-sm sm:text-base"
                                    >
                                        Learn More
                                        <ArrowRight className="h-4 w-4 shrink-0" />
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-12 sm:py-20 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12 px-4"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                            What Our Clients Say
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
                            Don't just take our word for it
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-800 rounded-2xl p-6 sm:p-8"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-300 text-base sm:text-lg mb-6 italic leading-relaxed">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0">
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm sm:text-base">{testimonial.name}</div>
                                        <div className="text-gray-400 text-xs sm:text-sm">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-20 bg-[#3a3a41]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="px-4"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Find Your Dream Property?
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-200 mb-8">
                            Let us help you find the perfect space that meets all your needs
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/properties"
                                className="bg-white text-[#3a3a41] px-6 sm:px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 font-semibold text-center"
                            >
                                Browse Properties
                            </Link>
                            <Link
                                href="/contact"
                                className="bg-transparent border-2 border-white text-white px-6 sm:px-8 py-4 rounded-lg hover:bg-white hover:text-[#3a3a41] transition-all font-semibold text-center"
                            >
                                Get in Touch
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
