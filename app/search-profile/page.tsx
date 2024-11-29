'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import SearchProfileAppBar from "../components/SearchProfileAppBar";
import NavBar from "../components/NavBar";

const SearchProfile: React.FC = () => {
  const router = useRouter();

  const handleTakePhoto = () => {
    router.push("/camera");
  };

  const handleUploadPhoto = () => {
    router.push("/upload-gallery");
  };

  const handleGSTSearch = () => {
    router.push("/search-gst");
  };

  const handlePANSearch = () => {
    router.push("/search-pan");
  };

  const handleMobileSearch = () => {
    router.push("/search-mobile");
  };

  const handleAadhaarSearch = () => {
    router.push("/search-aadhaar");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SearchProfileAppBar />
 
      <main className="flex-1 px-8 pt-20">
         <p className="text-lg text-neutral-600 mb-8">
          Choose your preferred method of search
        </p>

         <p className="text-base text-neutral-600 mb-4">
          Search by face
        </p>

        <div className="bg-neutral-50 rounded-lg overflow-hidden">
          <button
            onClick={handleTakePhoto}
            className="flex items-center gap-4 px-6 py-4 w-full hover:bg-neutral-100 transition-colors"
          >
            <Image
              src="/images/searchprofileicons/camera.svg"
              alt="Camera Icon"
              width={24} 
              height={24}
              className="text-pink-600"
            />
            <span className="text-base">Take a photo</span>
          </button>
          <button
            onClick={handleUploadPhoto}
            className="flex items-center gap-4 px-6 py-4 w-full hover:bg-neutral-100 transition-colors"
          >
            <Image
              src="/images/searchprofileicons/gallery.svg"
              alt="Gallery Icon"
              width={24} 
              height={24}
              className="text-pink-600"
            />
            <span className="text-base">Upload from gallery</span>
          </button>
        </div>

        <div className="h-8"></div>

         <div className="bg-neutral-50 rounded-lg divide-y divide-neutral-200">
          <button
            onClick={handleGSTSearch}
            className="flex items-center gap-4 px-6 py-4 w-full hover:bg-neutral-100 transition-colors"
          >
            <Image
              src="/images/searchprofileicons/searchbygst.svg"
              alt="GST Icon"
              width={22} 
              height={22}
            />
            <span className="text-base">Search by GST</span>
          </button>
          <button
            onClick={handleAadhaarSearch}
            className="flex items-center gap-4 px-6 py-4 w-full hover:bg-neutral-100 transition-colors"
          >
            <Image
              src="/images/searchprofileicons/aadhar.svg"
              alt="Aadhaar Icon"
              width={22} 
              height={22}
            />
            <span className="text-base">Search by Aadhaar</span>
          </button>
          <button
            onClick={handlePANSearch}
            className="flex items-center gap-4 px-6 py-4 w-full hover:bg-neutral-100 transition-colors"
          >
            <Image
              src="/images/searchprofileicons/pan.svg"
              alt="PAN Icon"
              width={22} 
              height={22}
            />
            <span className="text-base">Search by PAN</span>
          </button>
          <button
            onClick={handleMobileSearch}
            className="flex items-center gap-4 px-6 py-4 w-full hover:bg-neutral-100 transition-colors"
          >
            <Image
              src="/images/searchprofileicons/searchbymobile.svg"
              alt="Mobile Icon"
              width={22} 
              height={22}
            />
            <span className="text-base">Search by Mobile</span>
          </button>
        </div>
      </main>

      <NavBar />
    </div>
  );
};

export default SearchProfile;
