import React from 'react'
import { color, motion } from 'framer-motion'

const Returns = () => {
  return (
    <div style={styles.container}>
        <motion.h1
            initial={{ opacity: 0, y: -50}}
            animate= {{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            style={styles.heading}
        >
            Returns and Exchanges
        </motion.h1>
        <motion.p
            initial = {{ opacity: 0, x: -50}}
            animate = {{ opacity: 1, x: 0}}
            transition={{ duration: 0.6, delay: 0.2}}
            style={styles.subHeading}
        >
            Enter your order number and email or phne to find your order
        </motion.p>
        <motion.div 
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{ duration: 0.6, delay: 0.4}}
            style={styles.form}
        >
            <input
                type='text'
                placeholder='Order Number'
                style={styles.input}
            />
            <input
                type='text'
                placeholder='Email or Phone'
                style={styles.input}
            />
            <motion.button
                whileHover={{scale: 1.05, backgroundColor: "#dedede", color: "#000"}}
                whileTap={{scale: 0.95}}
                style={styles.button}
            >
                FIND YOUR ORDER
            </motion.button>
        </motion.div>
        <motion.p
            initial= {{ opacity: 0, y: 50}}
            animate= {{ opacity: 1, y: 0}}
            transition={{ duration: 0.6, delay: 0.6}}
            style={styles.infoText}
        >
            If you don't love your purchase or have a change of mind, you have 14 days to return it for 
            a store credit. If the product you have received is faulty, please reach out to {" "}
            <a
                href='mailto:44saturnsclothings@gmail.com'
                style={styles.email}>
                    44saturnsclothings@gmail.com
                </a>
                . The garment needs to be in its original, unworn condition to be accepted for a return.
        </motion.p>
        <motion.p
            initial= {{ opacity: 0}}
            animate= {{ opacity: 1}}
            transition={{ duration: 0.6, delay: 0.8}}
            style={styles.securedBy}
        >
            Secured by <strong>Return Prime</strong>
        </motion.p>
    </div>
  );
};

const styles = {
    container: {
        marginTop: "100px",
        maxWidth: "400px",
        margin: "0 auto",
        textAlign: "center",
        fontFamily: "Arial, san-serif",
        padding: "20px",
    },
    heading: {
        fontSize: "24px",
        marginBottom: "10px",
    },
    subHeading: {
        fontSize: "14px",
        marginBottom: "20px",
        color: "#555",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginBottom: "20px",
    },
    input: {
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "14px",
    },
    button: {
        padding: "10px",
        backgroundColor: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
    },
    infoText: {
        fontSize: "12px",
        color: "#555",
        marginBottom: "10px",
    },
    email: {
        color: "#000",
        textDecoration: "underline",
    },
    securedBy: {
        fontSize: "12px",
        color: "#999",
    },
};

export default Returns;