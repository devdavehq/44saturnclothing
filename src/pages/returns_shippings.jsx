import { motion } from 'framer-motion'
import NavBar from '../components/LandingPage/NavBar'
import { assets } from '../../Images/assets'
import Newsletter from "../components/LandingPage/Newsletter"
import { get } from '../api'

const About = () => {
  return (
    <div>
      <NavBar />
      <div className="py-20">
        {/* Shipping Policy Section */}
        <div className="md:w-[60%] w-full md:px-0 px-3" style={{ margin: "50px auto" }}>
          <h2 className="text-3xl font-bold mb-4">Shipping Policy</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-4">At 44saturnclothing we ensure your order reaches you quickly and securely. Below are our shipping details:</p>
            
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Orders are processed within 2-5 business days excluding weekends and holidays</li>
              <li>International orders may apply and are the responsibility of the customer</li>
              <li>All interstate deliveries are handled by DHL delivery company or GIGL</li>
            </ul>
            
            <p>For any questions regarding your order, feel free to contact our customer support team at <a href="mailto:44saturnclothing@gmail.com" className="text-blue-600">44saturnclothing@gmail.com</a> or <a href="tel:+2349024623040" className="text-blue-600">+2349024623040</a></p>
          </div>
        </div>

        {/* Return Policy Section */}
        <div className="md:w-[60%] w-full md:px-0 px-3" style={{ margin: "50px auto" }}>
          <h2 className="text-3xl font-bold mb-4">Return Policy</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Returns</h3>
            <p className="mb-4">We offer a 2-day return window from the date you receive your item. Returns are only accepted if the item arrives damaged or has a defect.</p>
            
            <p className="font-medium mb-2">To be eligible for a return, your item must be:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Unworn or unused</li>
              <li>In its original condition with tags attached</li>
              <li>Accompanied by proof of purchase</li>
            </ul>
            
            <h3 className="text-lg font-semibold mb-2 mt-4">Exchanges</h3>
            <p className="mb-4">If your item isn't the right size or doesn't match your preference, we're happy to assist you with an exchange for a different size or a different item. Simply reach out to us on any of our platforms, and we'll guide you through the process.</p>
            
            <h3 className="text-lg font-semibold mb-2">Refund</h3>
            <p className="mb-4">If your item meets the refund criteria, we will inspect products to determine if the refund is approved or not.</p>
            <p className="text-sm italic">Please note: refunds take 14 business days to process.</p>
            
            <p className="mt-4">For any concerns, feel free to reach out to our customer support team at <a href="mailto:44saturnclothing@gmail.com" className="text-blue-600">44saturnclothing@gmail.com</a> - we're happy to assist!</p>
          </div>
        </div>
      </div>
      <Newsletter />
    </div>
  )
}

export default About