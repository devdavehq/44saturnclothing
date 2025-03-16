import React from "react";
import { Link } from "react-router-dom";
import { assets } from '../../Images/assets'


const Collections = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6 p-6 mt-16">
      <div className="group">
        <Link to="/collection1">
          <img
            src={assets.background}
            alt="Collection 1"
            className="w-72 h-96 object-cover rounded-md shadow-lg group-hover:scale-105 transition-transform"
          />
          <p className="mt-2 text-center text-lg font-semibold">2024 / COLLECTION 1</p>
        </Link>
      </div>
      <div className="group">
        <Link to="/collection2">
          <img
            src={assets.background}
            alt="Collection 2"
            className="w-72 h-96 object-cover rounded-md shadow-lg group-hover:scale-105 transition-transform"
          />
          <p className="mt-2 text-center text-lg font-semibold">2024 / COLLECTION 2</p>
        </Link>
      </div>
      <div className="group">
        <Link to="/collection3">
          <img
            src={assets.background}
            alt="Collection 3"
            className="w-72 h-96 object-cover rounded-md shadow-lg group-hover:scale-105 transition-transform"
          />
          <p className="mt-2 text-center text-lg font-semibold">2024 / COLLECTION 3</p>
        </Link>
      </div>
    </div>
  );
};

export default Collections;
