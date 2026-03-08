import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      question: 'What classes are available at The Choice ICON Schools?',
      answer: 'The Choice ICON Schools provides education across multiple levels including Early Years, Nursery, Primary, and Secondary School. Our programs are designed to guide students through every stage of their academic and personal development.'
    },
    {
      question: 'What curriculum does the school operate?',
      answer: 'The Choice ICON Schools operates a hybrid Nigeria–British curriculum designed to provide students with both local academic excellence and international educational standards.'
    },
    {
      question: 'Where is The Choice ICON Schools located?',
      answer: 'The school is located at: ICON Avenue, off Delta State Polytechnic Road, Behind Joanchim Filling Station, Ogwashi-Uku, Delta State.'
    },
    {
      question: 'Is admission currently open?',
      answer: 'Yes. Admissions are open for Early Years, Nursery, Primary, and Secondary School. Parents can submit enquiries or contact the school for further admission information.'
    },
    {
      question: 'How can I apply for admission?',
      answer: (
        <ul className="list-decimal pl-5 space-y-2">
          <li>Filling out the admission enquiry form on the website</li>
          <li>Contacting the school through WhatsApp or phone</li>
          <li>Visiting the school campus for further assistance.</li>
        </ul>
      )
    },
    {
      question: 'What makes The Choice ICON Schools different from other schools?',
      answer: 'The Choice ICON Schools focuses on academic excellence, moral instruction, and character development. The institution was established with the mission of steering young learners away from moral and intellectual decadence while nurturing them to become future icons.'
    },
    {
      question: 'Does the school provide a safe learning environment?',
      answer: 'Yes. The school provides a conducive and serene learning environment where students can grow academically, socially, and emotionally.'
    },
    {
      question: 'Are the teachers qualified?',
      answer: 'Yes. The Choice ICON Schools employs highly qualified and motivated staff who regularly participate in professional development and training to maintain high teaching standards.'
    },
    {
      question: 'Does the school have modern learning facilities?',
      answer: (
        <div>
          <p>Yes. The school provides several learning facilities including:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Well-equipped science laboratories</li>
            <li>State-of-the-art computer laboratory</li>
            <li>Excellent teaching resources from around the globe</li>
          </ul>
        </div>
      )
    },
    {
      question: 'Does the school offer ICT education?',
      answer: 'Yes. The school has a modern ICT laboratory designed to equip students with digital and technological skills necessary for the modern world.'
    },
    {
      question: 'Does the school provide transportation services?',
      answer: 'Yes. The Choice ICON Schools provides an efficient and effective transport system to help students commute safely to and from school.'
    },
    {
      question: 'Is there a medical facility available for students?',
      answer: 'Yes. The school has a well-equipped healing bay with qualified personnel to handle basic medical needs and ensure the wellbeing of students.'
    },
    {
      question: 'Does the school provide moral and character training?',
      answer: 'Yes. The Choice ICON Schools strongly emphasizes counselling and moral instruction to help students develop strong character alongside academic knowledge.'
    },
    {
      question: 'What is the mission of The Choice ICON Schools?',
      answer: 'The mission of The Choice ICON Schools is to provide a challenging and rigorous curriculum that allows every student to progress at an appropriate developmental pace within a safe learning environment.'
    },
    {
      question: 'What is the vision of the school?',
      answer: 'The vision of The Choice ICON Schools is to become a leading international best-practice school that inspires students to achieve great things and become future icons through dynamic teaching and learning.'
    },
    {
      question: 'When was The Choice ICON Schools founded?',
      answer: 'The Choice ICON Schools was founded in September 2021.'
    },
    {
      question: 'Who is the principal of the school?',
      answer: 'The principal of The Choice ICON Schools is Emmanuel M. Odiniya.'
    },
    {
      question: 'How can I contact the school?',
      answer: (
        <div>
          <p>You can contact the school through:</p>
          <div className="mt-2">
            <p className="font-bold">Phone:</p>
            <p>+234-806-9077-937</p>
            <p>+234-810-7601-537</p>
          </div>
          <div className="mt-2">
            <p className="font-bold">Email:</p>
            <a href="mailto:thechoiceiconschools@gmail.com" className="text-sky-blue hover:underline">thechoiceiconschools@gmail.com</a>
          </div>
          <p className="mt-2">You can also reach the school through the WhatsApp button on the website.</p>
        </div>
      )
    },
    {
      question: 'Can parents visit the school?',
      answer: 'Yes. Parents who would like to see the school environment can contact the school to schedule a visit.'
    },
    {
      question: 'Does the school focus only on academics?',
      answer: 'No. The Choice ICON Schools focuses on holistic development, including academics, social development, moral instruction, and creative learning experiences.'
    },
    {
      question: 'Does the school integrate arts into learning?',
      answer: 'Yes. The school integrates arts into learning opportunities because it believes students learn better with and through the arts.'
    },
    {
      question: 'Can I apply for a job at the school?',
      answer: 'Yes. The school accepts job applications from passionate individuals who want to contribute to its mission. Interested applicants can fill out the Job Application Form on the Careers page and upload their CV.'
    },
    {
      question: 'How do I make an enquiry about the school?',
      answer: (
        <div>
          <p>You can submit your enquiry through:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The Visitors Enquiry Form on the website</li>
            <li>WhatsApp</li>
            <li>Phone call</li>
            <li>Email</li>
          </ul>
        </div>
      )
    },
    {
      question: 'What is the motto of The Choice ICON Schools?',
      answer: 'The school motto is: “Grooming ICONS.”'
    },
    {
      question: 'Why should I choose The Choice ICON Schools for my child?',
      answer: (
        <div>
          <p>The Choice ICON Schools provides a strong foundation for students through:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Quality education</li>
            <li>Highly qualified teachers</li>
            <li>Modern learning facilities</li>
            <li>Moral and character development</li>
            <li>A safe and supportive learning environment.</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>FAQ | The Choice ICON Schools</title>
        <meta name="description" content="Frequently Asked Questions about The Choice ICON Schools." />
      </Helmet>

      <div className="bg-navy-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Find answers to common questions</p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-bold text-navy-blue text-base">{faq.question}</span>
                  {openIndex === idx ? <ChevronUp className="text-sky-blue" /> : <ChevronDown className="text-gray-400" />}
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-gray-50 px-6 pb-6 text-gray-600 leading-relaxed text-sm"
                    >
                      <div className="pt-4 border-t border-gray-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
