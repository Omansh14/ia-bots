import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-9xl font-bold text-secondary">404</h1>
        <h2 className="text-3xl font-semibold text-secondary">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="hover:cursor-pointer"
          >
            Go Back
          </Button>
          <Button 
            onClick={() => navigate("/")}
            className="hover:cursor-pointer"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;