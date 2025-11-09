// app/outlets/page.tsx
import { OutletCard } from "@/src/components/outlets/OutletCard";
import { SearchAndFilter } from "@/src/components/outlets/SearchAndFilter";
import { TBranch } from "@/src/interface/branch";
import { getAllBranches } from "@/src/services/BranchService";
import { MapPin, Clock, Phone, Globe } from "lucide-react";
import Image from "next/image";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Or alternatively, you can use:
// export const revalidate = 0;

export default async function OutletsPage() {
  let outlets: TBranch[] = [];
  
  try {
    const response = await getAllBranches(
      { status: "active" },
      { limit: 12 }
    );
    outlets = response.data || [];
  } catch (error) {
    console.error("Error fetching outlets:", error);
    outlets = [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Outlets</h1>
            <p className="text-xl md:text-2xl mb-8">
              Discover our premium locations across the country, designed to
              serve you better
            </p>
            <SearchAndFilter />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-1 origin-top-left"></div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-all">
              <MapPin className="h-10 w-10 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Multiple Locations</h3>
              <p className="text-gray-600">
                Conveniently located across major cities
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-all">
              <Clock className="h-10 w-10 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Extended Hours</h3>
              <p className="text-gray-600">Open late to serve you better</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-all">
              <Phone className="h-10 w-10 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
              <p className="text-gray-600">24/7 customer service available</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-all">
              <Globe className="h-10 w-10 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Global Standards</h3>
              <p className="text-gray-600">Consistent quality worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Outlets Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Locations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the nearest outlet to experience our premium services
            </p>
          </div>

          {outlets.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {outlets.map((outlet: TBranch) => (
                  <OutletCard key={outlet._id} outlet={outlet} />
                ))}
              </div>

              <div className="mt-12 text-center">
                <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                  Load More Locations
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No outlets available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Map CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Find Us on the Map
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our outlets are strategically located for your convenience. Use
                our interactive map to find the nearest location, get
                directions, and check real-time availability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Open Interactive Map
                </button>
                <button className="px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                  Download Locations List
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 relative h-96 rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/images/map-placeholder.jpg"
                alt="Map of our locations"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-blue-600 opacity-10"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}