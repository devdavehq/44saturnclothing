import React, { useRef } from 'react'
import NavBar from '../components/LandingPage/NavBar'
import HeroSection from '../components/LandingPage/HeroSection'
import ProductGrid from "../components/LandingPage/ProductGrid"
import Newsletter from "../components/LandingPage/Newsletter"
import NewsletterPopup from "./newsletter"

import { motion, useInView } from 'framer-motion'

const childVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const ScrollReveal = ({ children }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { triggerOnce: true, margin: "-100px" })

  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={childVariants}>
      {children}
    </motion.div>
  )
}

const HomePage = () => {
  return (
    <div>
      <NavBar />
      <ScrollReveal>
        <HeroSection />
      </ScrollReveal>
      <ScrollReveal>
        <ProductGrid />
      </ScrollReveal>
      <ScrollReveal>
        <Newsletter />
      </ScrollReveal>
    <NewsletterPopup/>
    </div>
  )
}

export default HomePage
