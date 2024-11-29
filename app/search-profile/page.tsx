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
 
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 pt-16 pb-24 bg-gradient-to-br from-white to-pink-50 min-h-full">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-neutral-800 mb-3 bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent">
              Search Profile
            </h1>
            <p className="text-base text-neutral-600 mb-8">
              Choose your preferred method to search
            </p>

            {/* Face Search Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-neutral-700 mb-4">
                Search by Face
              </h2>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-pink-100">
                <button
                  onClick={handleTakePhoto}
                  className="flex items-center gap-4 px-6 py-5 w-full hover:bg-pink-50 transition-all duration-300 border-b border-pink-100"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <Image
                      src="/images/searchprofileicons/camera.svg"
                      alt="Camera Icon"
                      width={24} 
                      height={24}
                      className="text-pink-600"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-base font-medium text-neutral-800">Take a photo</span>
                    <p className="text-sm text-neutral-500 mt-1">Capture a new photo to search</p>
                  </div>
                </button>
                <button
                  onClick={handleUploadPhoto}
                  className="flex items-center gap-4 px-6 py-5 w-full hover:bg-pink-50 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <Image
                      src="/images/searchprofileicons/gallery.svg"
                      alt="Gallery Icon"
                      width={24} 
                      height={24}
                      className="text-pink-600"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-base font-medium text-neutral-800">Upload from gallery</span>
                    <p className="text-sm text-neutral-500 mt-1">Choose an existing photo</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Other Search Methods */}
            <div>
              <h2 className="text-lg font-semibold text-neutral-700 mb-4">
                Other Search Methods
              </h2>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-pink-100 divide-y divide-pink-100">
                <button
                  onClick={handleGSTSearch}
                  className="flex items-center gap-4 px-6 py-5 w-full hover:bg-pink-50 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <Image
                      src="/images/searchprofileicons/searchbygst.svg"
                      alt="GST Icon"
                      width={22} 
                      height={22}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-base font-medium text-neutral-800">Search by GST</span>
                    <p className="text-sm text-neutral-500 mt-1">Find profiles using GST number</p>
                  </div>
                </button>
                <button
                  onClick={handleAadhaarSearch}
                  className="flex items-center gap-4 px-6 py-5 w-full hover:bg-pink-50 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <Image
                      src="/images/searchprofileicons/aadhar.svg"
                      alt="Aadhaar Icon"
                      width={22} 
                      height={22}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-base font-medium text-neutral-800">Search by Aadhaar</span>
                    <p className="text-sm text-neutral-500 mt-1">Find profiles using Aadhaar number</p>
                  </div>
                </button>
                <button
                  onClick={handlePANSearch}
                  className="flex items-center gap-4 px-6 py-5 w-full hover:bg-pink-50 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <Image
                      src="/images/searchprofileicons/pan.svg"
                      alt="PAN Icon"
                      width={22} 
                      height={22}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-base font-medium text-neutral-800">Search by PAN</span>
                    <p className="text-sm text-neutral-500 mt-1">Find profiles using PAN number</p>
                  </div>
                </button>
                <button
                  onClick={handleMobileSearch}
                  className="flex items-center gap-4 px-6 py-5 w-full hover:bg-pink-50 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <Image
                      src="/images/searchprofileicons/searchbymobile.svg"
                      alt="Mobile Icon"
                      width={22} 
                      height={22}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-base font-medium text-neutral-800">Search by Mobile</span>
                    <p className="text-sm text-neutral-500 mt-1">Find profiles using mobile number</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <NavBar />
    </div>
  );
};

export default SearchProfile;
