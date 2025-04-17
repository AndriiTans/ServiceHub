type LoadingModalProps = {
  text: string;
};

const LoadingModal = ({ text }: LoadingModalProps) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
        <p className="text-gray-700">{text}</p>
      </div>
    </div>
  );
};

export default LoadingModal;
