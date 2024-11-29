'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import SearchProfileAppBar from "../components/RequestLoanAppBar";
import NavBar from "../components/NavBar";

const SearchProfile: React.FC = () => {

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SearchProfileAppBar />
 
      <NavBar />
    </div>
  );
};

export default SearchProfile;
