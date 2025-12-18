'use client';

import { TBranch } from '@/src/interface/branch';
import { MapPin, Clock, Phone, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function OutletCard({ outlet }: { outlet: TBranch }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={outlet.images?.[0] || '/images/outlet-default.jpg'}
          alt={outlet.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
          {outlet.status === 'active' ? 'Open Now' : 'Closed'}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{outlet.name}</h3>
        <p className="text-gray-600 mb-4 flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-blue-600" />
          {outlet.location.address}, {outlet.location.city}
        </p>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-600" />
            Opening Hours
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {outlet.operatingHours.map((hours) => (
              <li key={hours.day} className="flex justify-between">
                <span className="capitalize">{hours.day}</span>
                {hours.isClosed ? (
                  <span className="text-red-500">Closed</span>
                ) : (
                  <span>
                    {hours.openingTime} - {hours.closingTime}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between mt-6">
          <a
            href={`tel:${outlet.contact.phone}`}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Phone className="h-4 w-4 mr-2" />
            {outlet.contact.phone}
          </a>
          <button
            onClick={() => router.push(`/outlets/${outlet._id}`)}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
