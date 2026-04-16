import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ProgressBarProvider from "@/components/ProgressBarProvider";
import { Open_Sans } from "next/font/google";
import Script from "next/script";
import MixpanelInit from "@/components/MixpanelInit";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-open-sans"
});


export const metadata: Metadata = {
  title: "Event Parcel",
  description: "Do your business transaction here!!"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={openSans.variable}>
      <head>
        {/* Google Maps */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDSJLDP8ehodqfX8FEFjhfOyp7NNniFUa4&libraries=places`}
          strategy="beforeInteractive"
          async
          defer
        />
        {/* Facebook Pixel */}
        <Script
          id="facebook-pixel"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '945469877974377');
              fbq('track', 'PageView');
            `
          }}
        />
        {/* Facebook Pixel noscript */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=945469877974377&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="w-full max-w-full">
        {/* ✅ Microsoft Clarity script */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "rivbhogpyk");
            `
          }}
        />

        <MixpanelInit />
        <ProgressBarProvider>{children}</ProgressBarProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}










// import type { Metadata } from "next";
// import "./globals.css";
// import { Toaster } from "react-hot-toast";
// import ProgressBarProvider from "@/components/ProgressBarProvider";
// import { Open_Sans } from "next/font/google";
// import Script from "next/script";
// import MixpanelInit from "@/components/MixpanelInit";

// // Load all font weights
// const openSans = Open_Sans({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700", "800"],
//   variable: "--font-open-sans" // Optional: CSS variable for usage
// });

// export const metadata: Metadata = {
//   title: "Event Parcel",
//   description: "Do your business transaction here!!"
// };

// export default function RootLayout({
//   children
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" className={openSans.variable}>
//       <head>
//         {/* Load the Google Maps API globally, including the Places library */}
//         <Script
//           src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDSJLDP8ehodqfX8FEFjhfOyp7NNniFUa4&libraries=places`}
//           strategy="beforeInteractive"
//           async
//           defer
//         />
//       </head>
//       <body className="w-full max-w-full">
//         <MixpanelInit /> 
//         <ProgressBarProvider>{children}</ProgressBarProvider>
//         <Toaster position="top-right" />
//       </body>
//     </html>
//   );
// }

















// import type { Metadata } from "next";
// import "./globals.css";
// import { Toaster } from "react-hot-toast";
// import ProgressBarProvider from "@/components/ProgressBarProvider";
// import { Open_Sans } from "next/font/google";


// // Load all font weights
// const openSans = Open_Sans({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700", "800"],
//   variable: "--font-open-sans" // Optional: CSS variable for usage
// });

// export const metadata: Metadata = {
//   title: "Event Parcel",
//   description: "Do your business transaction here!!"
// };

// export default function RootLayout({
//   children
// }: Readonly<{
//   children: React.ReactNode;
// }>) {

//   return (
//     <html lang="en" className={openSans.variable}>
//       <body className="w-full max-w-full">
//         <ProgressBarProvider>{children}</ProgressBarProvider>
//         <Toaster position="top-right" />
//       </body>
//     </html>
//   );
// }
