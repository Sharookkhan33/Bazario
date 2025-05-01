import { Typography } from "@material-tailwind/react";

export default function AboutUs() {
  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-2xl p-8 md:p-12">
        <Typography
          variant="h2"
          className="mb-6 text-center text-blue-gray-900 font-semibold"
        >
          About Us
        </Typography>
        <Typography className="text-blue-gray-700 text-base md:text-lg leading-relaxed text-justify">
          Welcome to our <strong>Bazario</strong>! We are passionate about
          connecting sellers and customers in a seamless e-commerce experience.
          Whether you're looking to buy or sell, our platform offers security,
          flexibility, and tools to help you grow.
          <br />
          <br />
          Our mission is to empower small businesses by providing a trusted and
          scalable platform. We work tirelessly to ensure transparency, fast
          support, and continuous innovation.
          <br />
          <br />
          Thank you for being a part of our journey.
        </Typography>
      </div>
    </section>
  );
}
