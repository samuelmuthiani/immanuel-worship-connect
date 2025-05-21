
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-9xl font-bold mb-4 text-iwc-orange">404</h1>
          <h2 className="text-3xl font-semibold mb-6 text-gray-900">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            We're sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="bg-iwc-blue hover:bg-iwc-orange text-white font-bold py-3 px-8">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
