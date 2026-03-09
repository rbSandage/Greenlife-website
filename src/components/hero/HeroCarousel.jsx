// import { Swiper, SwiperSlide } from "swiper/react"
// import { Autoplay, Pagination } from "swiper/modules"
// import { Link } from "react-router-dom"

// import "swiper/css"
// import "swiper/css/pagination"

// export default function HeroCarousel() {

//   const slides = [
//     {
//       title: "Advanced Crop Protection",
//       subtitle: "Protecting Every Stage of Growth",
//       image: "/images/hero1.jpg"
//     },
//     {
//       title: "Higher Yield Farming",
//       subtitle: "Scientifically Developed Fertilizers",
//       image: "/images/hero2.jpg"
//     },
//     {
//       title: "Healthy Soil. Healthy Harvest.",
//       subtitle: "Organic & Bio Crop Solutions",
//       image: "/images/hero3.jpg"
//     }
//   ]

//   return (
//     <section className="relative h-[85vh] w-full">

//       <Swiper
//         modules={[Autoplay, Pagination]}
//         autoplay={{ delay:5000 }}
//         pagination={{ clickable:true }}
//         loop
//         className="h-full"
//       >

//         {slides.map((slide,i)=>(
//           <SwiperSlide key={i}>

//             <div
//               className="relative h-[85vh] bg-cover bg-center flex items-center justify-center"
//               style={{ backgroundImage:`url(${slide.image})` }}
//             >

//               {/* dark overlay */}
//               <div className="absolute inset-0 bg-black/55"></div>

//               {/* content */}
//               <div className="relative z-10 text-center px-6">

//                 <h1 className="text-white font-bold leading-tight text-4xl md:text-6xl lg:text-7xl">
//                   {slide.title}
//                 </h1>

//                 <p className="text-white/80 text-lg md:text-xl mt-4">
//                   {slide.subtitle}
//                 </p>

//                 <div className="mt-8 flex justify-center gap-4">

//                   <Link
//                     to="/products"
//                     className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-md transition"
//                   >
//                     Explore Products
//                   </Link>

//                   <Link
//                     to="/contact"
//                     className="border border-white/40 text-white px-8 py-3 rounded-md hover:bg-white/10 transition"
//                   >
//                     Get Advice
//                   </Link>

//                 </div>

//               </div>

//             </div>

//           </SwiperSlide>
//         ))}

//       </Swiper>

//     </section>
//   )
// }