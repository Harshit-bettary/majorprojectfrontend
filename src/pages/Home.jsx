import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

function Home() {
  return (
    <div className="font-poppins antialiased">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center text-2xl font-bold text-indigo-800 gap-2">
            <Car className="w-8 h-8 text-amber-500" />
            DriveEasy
          </Link>
          <div className="flex space-x-8 text-base font-medium">
            <a href="#home" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">Home</a>
            <a href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">About Us</a>
            <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">Contact Us</a>
          </div>
          <div className="flex space-x-4">
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-200 py-2 px-4">Login</Link>
            <Link to="/signup" className="bg-amber-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-amber-600 transition-colors duration-200">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-indigo-700 to-indigo-500 flex flex-col items-center justify-center min-h-[80vh] text-white text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Welcome to <span className="text-amber-400">DriveEasy</span>
        </h1>
        <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mb-8">
          Rent cars, bikes, or vans with ease and start your journey today.
        </p>
        <Link
          to="/vehicles"
          className="bg-amber-400 text-gray-900 py-3 px-10 rounded-full font-semibold text-lg hover:bg-amber-500 transition-colors duration-300"
        >
          Browse Vehicles
        </Link>
      </section>

      {/* Car Interior Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-6">Experience Comfort</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Step inside our premium vehicles, designed for comfort and style on every journey.
          </p>
          <div className="relative max-w-5xl mx-auto">
            <img
              src="https://strapiallsopp.s3.eu-west-1.amazonaws.com/Car_Hero_1920x800_f2e20f388c.jpeg"
              alt="Luxury car interior"
              className="w-full h-[400px] object-cover rounded-xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-12">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'John Doe',
                feedback: 'The booking process was seamless, and the car was in excellent condition!',
                img: 'https://randomuser.me/api/portraits/men/32.jpg',
              },
              {
                name: 'Jane Smith',
                feedback: 'I loved the variety of vehicles available. Highly recommend this service!',
                img: 'https://randomuser.me/api/portraits/women/44.jpg',
              },
              {
                name: 'Michael Brown',
                feedback: 'Great customer support and affordable prices. Will use again!',
                img: 'https://randomuser.me/api/portraits/men/76.jpg',
              },
            ].map(({ name, feedback, img }, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src={img}
                  alt={name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover border-2 border-indigo-100"
                />
                <p className="text-gray-600 text-base mb-4 italic">"{feedback}"</p>
                <h3 className="text-lg font-semibold text-indigo-700">{name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="bg-white py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-12 text-center">About DriveEasy</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <img
              src="https://i.insider.com/5ef4fe1a3f737016874700b7?width=1200&format=jpeg"
                alt="Car rental handover"
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
            <div className="md:w-1/2 text-center md:text-left">
              <p className="text-lg text-gray-700 mb-4">
                <span className="font-semibold text-amber-500">DriveEasy</span> makes travel simple and reliable. Since 2015, we’ve offered a wide range of vehicles—from compact cars to SUVs and bikes—for every adventure.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Our focus is on quality and customer satisfaction, with well-maintained vehicles and easy online bookings. Let us drive your next journey.
              </p>
              <Link
                to="/vehicles"
                className="inline-block bg-indigo-700 text-white py-2 px-6 rounded-full font-semibold hover:bg-indigo-800 transition-colors duration-300"
              >
                View Our Fleet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="bg-indigo-50 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-12">Contact Us</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Reach out for help with bookings or any questions. We’re here 24/7.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">Main Office</h3>
              <p className="text-gray-600">123 MG Road, Bengaluru, Karnataka 560001, India</p>
              <p className="text-gray-600 mt-2">Hours: Mon–Sun, 9:00 AM – 6:00 PM</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">Customer Support</h3>
              <p className="text-gray-600">Phone: +91-9876543210</p>
              <p className="text-gray-600 mt-2">
                Email: <a href="mailto:support@driveeasy.in" className="text-indigo-600 hover:underline">support@driveeasy.in</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-base mb-4">© 2025 DriveEasy. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <Link to="/" className="text-indigo-200 hover:text-amber-400 transition-colors duration-200">Home</Link>
            <Link to="/vehicles" className="text-indigo-200 hover:text-amber-400 transition-colors duration-200">Vehicles</Link>
            <Link to="/about" className="text-indigo-200 hover:text-amber-400 transition-colors duration-200">About Us</Link>
            <Link to="/contact" className="text-indigo-200 hover:text-amber-400 transition-colors duration-200">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;