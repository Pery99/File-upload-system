import Image from "next/image";
import FileUpload from "../src/components/FileUpload";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <FileUpload />
    </div>
  );
}
