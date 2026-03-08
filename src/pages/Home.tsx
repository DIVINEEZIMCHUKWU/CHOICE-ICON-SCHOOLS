import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ArrowRight, BookOpen, Users, Award, Monitor, Heart, Bus, Shield, Globe, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
      title: 'WELCOME TO OUR SCHOOL',
      subtitle: 'Grooming Icons',
      text: 'An Institution with a mandate to steer our young ones away from moral and intellectual decadence.'
    },
    {
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop',
      title: 'EXCELLENCE IN EDUCATION',
      subtitle: 'Nigeria British Curriculum',
      text: 'Providing a challenging and rigorous curriculum that helps each student progress.'
    },
    {
      image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2072&auto=format&fit=crop',
      title: 'MODERN FACILITIES',
      subtitle: 'State of the Art',
      text: 'Equipped with science laboratories, ICT labs, and a serene learning environment.'
    }
  ];

  const features = [
    { icon: <Award className="w-8 h-8 text-sky-blue" />, title: 'Qualitative Education' },
    { icon: <Monitor className="w-8 h-8 text-sky-blue" />, title: 'Well Equipped Science Labs' },
    { icon: <Heart className="w-8 h-8 text-sky-blue" />, title: 'Conducive Environment' },
    { icon: <Users className="w-8 h-8 text-sky-blue" />, title: 'Highly Qualified Staff' },
    { icon: <Monitor className="w-8 h-8 text-sky-blue" />, title: 'State of Art Computer Lab' },
    { icon: <Bus className="w-8 h-8 text-sky-blue" />, title: 'Efficient Transport' },
    { icon: <Shield className="w-8 h-8 text-sky-blue" />, title: 'Well-equipped Healing Bay' },
    { icon: <Globe className="w-8 h-8 text-sky-blue" />, title: 'Global Teaching Resources' },
    { icon: <Users className="w-8 h-8 text-sky-blue" />, title: 'Counselling & Moral Instruction' },
  ];

  return (
    <>
      <Helmet>
        <title>Home | The Choice ICON Schools</title>
        <meta name="description" content="Welcome to The Choice ICON Schools. We offer Early Years, Nursery, Primary and Secondary education with a Nigeria-British curriculum." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] lg:h-[700px]">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                  <div className="max-w-4xl">
                    <h2 className="text-sky-blue font-bold tracking-widest uppercase mb-4 text-xs md:text-base animate-fade-in-up">
                      {slide.subtitle}
                    </h2>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up delay-200">
                      {slide.title}
                    </h1>
                    <p className="text-gray-200 text-base md:text-lg mb-10 max-w-2xl mx-auto animate-fade-in-up delay-300">
                      {slide.text}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-500">
                  <Link 
                    to="/admissions" 
                    className="bg-sky-blue hover:bg-deep-blue text-white px-6 py-3 rounded-full font-bold text-base transition-all shadow-lg hover:shadow-sky-blue/30"
                  >
                    Apply for Admission
                  </Link>
                  <Link 
                    to="/contact" 
                    className="bg-transparent border-2 border-white hover:bg-white hover:text-navy-blue text-white px-6 py-3 rounded-full font-bold text-base transition-all"
                  >
                    Contact Us
                  </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-sky-blue/10 rounded-tl-3xl -z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop" 
                  alt="Students learning" 
                  className="rounded-2xl shadow-2xl w-full object-cover h-[400px]"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl max-w-xs hidden md:block">
                  <p className="text-navy-blue font-bold text-base mb-2">"Train up a child..."</p>
                  <p className="text-gray-500 text-sm italic">Proverb 22:6</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h4 className="text-sky-blue font-bold uppercase tracking-wider mb-2 text-sm">Welcome to</h4>
              <h2 className="text-3xl font-bold text-navy-blue mb-6">The Choice ICON Schools</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
                <p>
                  Welcome to The Choice ICON Schools! We are academically selective schools offering Nigeria British curriculum.
                </p>
                <p>
                  The birth of this great institution was borne out of passion, desire and a sense of duty. It is a divine project and the outcome of inspiration and revelation.
                </p>
                <p className="font-medium text-deep-blue">
                  It is an institution with a mandate to steer our young ones away from moral and intellectual decadence.
                </p>
                <p>
                  The scripture admonishes us to train up a child in the way he should go, even when he is old he will not depart from it. (Proverb 22:6).
                </p>
              </div>
              <div className="mt-8">
                <Link to="/about" className="text-sky-blue font-semibold flex items-center gap-2 hover:gap-4 transition-all group">
                  Read More About Us <ArrowRight size={20} className="group-hover:text-deep-blue" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Schools Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-blue mb-4">Our Schools</h2>
            <div className="w-16 h-1 bg-sky-blue mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Early Years', icon: '🧸', desc: 'Nurturing the youngest minds with care and foundational learning.' },
              { title: 'Nursery / Primary', icon: '📚', desc: 'Building strong academic foundations and moral character.' },
              { title: 'Secondary Schools', icon: '🎓', desc: 'Preparing future leaders with rigorous academic standards.' }
            ].map((school, idx) => (
              <motion.div 
                key={idx}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border-b-4 border-transparent hover:border-sky-blue group"
              >
                <div className="text-4xl mb-6 bg-sky-blue/10 w-20 h-20 rounded-full flex items-center justify-center group-hover:bg-sky-blue group-hover:text-white transition-colors">
                  {school.icon}
                </div>
                <h3 className="text-lg font-bold text-navy-blue mb-3">{school.title}</h3>
                <p className="text-gray-600 mb-6 text-sm">{school.desc}</p>
                <Link to="/academics" className="text-sky-blue font-medium hover:text-deep-blue">Learn more &rarr;</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-navy-blue text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform origin-top-right"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-sky-blue p-2 rounded-lg">
                  <Award size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">Our Mission</h3>
              </div>
              <p className="text-gray-200 leading-relaxed text-sm">
                The Choice ICON Schools is committed to providing a challenging and rigorous curriculum that helps each student progress at a developmentally appropriate rate and provides a safe environment for all students.
              </p>
            </div>
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-sky-blue p-2 rounded-lg">
                  <Globe size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">Our Vision</h3>
              </div>
              <p className="text-gray-200 leading-relaxed text-sm">
                To become a leading International Best Practice Schools, connecting and impacting our students to do great things in life and to produce future ICONS through dynamic teaching and learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-blue mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">We provide a comprehensive educational experience designed to groom the next generation of icons.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="flex items-start gap-4 p-6 rounded-xl border border-gray-100 hover:border-sky-blue/30 hover:shadow-lg transition-all bg-white"
              >
                <div className="shrink-0 bg-sky-blue/5 p-3 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-bold text-navy-blue mb-1">{feature.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Quote */}
      <section className="py-16 bg-sky-blue/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <BookOpen className="w-10 h-10 text-sky-blue mx-auto mb-6" />
          <blockquote className="text-xl md:text-2xl font-serif italic text-navy-blue mb-6">
            "Intelligence plus character – that is the goal of true education"
          </blockquote>
          <cite className="text-gray-600 font-semibold not-italic text-sm">— Martin Luther King Jr.</cite>
          <div className="mt-8 text-gray-700 leading-relaxed text-sm md:text-base">
            <p>The school operates a hybrid curriculum consisting of Nigeria British. Our institution is comprised of highly motivated and experienced teachers who received continual professional development and schedule training session often.</p>
          </div>
        </div>
      </section>

      {/* Principal Welcome */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-blue rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center text-white">
                <h3 className="text-sky-blue font-bold tracking-wider mb-2 uppercase text-xs">Principal's Welcome</h3>
                <h2 className="text-2xl font-bold mb-6">Emmanuel M. Odiniya</h2>
                <div className="text-gray-300 leading-relaxed mb-8 space-y-4 text-sm">
                  <p>
                    "The Choice ICON Schools located in Ogwashi-uku, Delta State. A day schools that cut across Early Years, Nursery, Primary and Secondary. The Choice ICON Schools was founded in September, 2021. The founder of the Schools is an avid lover of education, value the social and emotional development of each child as they transit from their Early Years, Nursery, Primary and Secondary through early adolescence.
                  </p>
                  <p>
                    As a believer in teamwork, it is my responsibility to maintain and to continue to build a supportive and collaborative spirit at our great institution. Together as a school community, we will lay solid foundation to meet the challenges of the future in innovative and exciting ways.
                  </p>
                  <p>
                    The Choice ICON Schools is defined by its motto: Grooming ICONS. Our motto anchor on academic excellence and partnering with parents in nurturing of sound minds and to encourage meaningful interaction between staff and learners and to become a leading international best practicing Schools of Choice."
                  </p>
                </div>
              </div>
              <div className="relative h-96 md:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1974&auto=format&fit=crop" 
                  alt="Principal - Emmanuel M. Odiniya" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-deep-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Happy Students' },
              { number: '25+', label: 'Qualified Teachers' },
              { number: '20+', label: 'Modern Facilities' },
              { number: '100%', label: 'Success Rate' }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl md:text-4xl font-bold text-sky-blue mb-2">{stat.number}</div>
                <div className="text-[10px] md:text-xs text-gray-300 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold text-navy-blue mb-4">Ready to Join Us?</h2>
              <p className="text-gray-600 max-w-xl text-sm">Admissions are open for the new academic session. Secure a spot for your child today in an environment that fosters excellence.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link to="/admissions" className="bg-sky-blue hover:bg-deep-blue text-white px-6 py-3 rounded-full font-bold text-center transition-colors shadow-lg shadow-sky-blue/20 text-base">
                Apply Now
              </Link>
              <div className="flex flex-col gap-2 sm:flex-row">
                <a href="tel:+2348069077937" className="bg-white border border-gray-200 hover:border-navy-blue hover:text-navy-blue text-gray-700 px-4 py-3 rounded-full font-bold text-center transition-colors flex items-center justify-center gap-2 text-xs whitespace-nowrap">
                  <Phone size={16} /> +234-806-9077-937
                </a>
                <a href="tel:+2348107601537" className="bg-white border border-gray-200 hover:border-navy-blue hover:text-navy-blue text-gray-700 px-4 py-3 rounded-full font-bold text-center transition-colors flex items-center justify-center gap-2 text-xs whitespace-nowrap">
                  <Phone size={16} /> +234-810-7601-537
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
